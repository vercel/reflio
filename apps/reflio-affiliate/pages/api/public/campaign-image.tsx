import { ImageResponse } from '@vercel/og';
import { postData, priceString } from '@/utils/helpers';
import { NextRequest } from 'next/server';

export const config = {
  runtime: 'experimental-edge',
};

const ogImageGenerate = async (companyHandle: any, campaignId: any) => {
  const { campaign } = await postData({
    url: `${process.env.NEXT_PUBLIC_AFFILIATE_SITE_URL}/api/public/campaign`,
    token: null,
    data: {
      "companyHandle": companyHandle ? companyHandle : null,
      "campaignId": campaignId ? campaignId : null
    }
  });

  return campaign;
};

export default async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const hasCompanyHandle = searchParams.has('companyHandle');
  const hasCampaignId = searchParams.has('campaignId');
  const companyHandle = hasCompanyHandle ? searchParams.get('companyHandle')?.slice(0, 100) : null;
  const campaignId = hasCampaignId ? searchParams.get('campaignId')?.slice(0, 100) : null;
  const campaign = companyHandle !== null ? await ogImageGenerate(companyHandle, campaignId) : null;

  return new ImageResponse(
    (
      // Modified based on https://tailwindui.com/components/marketing/sections/cta-sections
      <div style={{"background":"linear-gradient(75deg, rgba(236,236,236,1) 0%, rgba(255,255,255,1) 47%, rgba(194,194,194,1) 100%)"}} tw="flex flex-col items-center justify-center text-center w-full h-full">
        {
          campaign?.company_name ?
            <div tw="flex flex-col items-center justify-center">
              {
                campaign?.company_image !== null ? 
                  <div tw="flex h-28 w-auto mx-auto max-w-sm mb-3">
                    <img style={{ objectFit: 'contain' }} tw="w-full h-full" alt="Logo" src={`${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}${campaign?.company_image}`}/>
                  </div>
                : 
                  <h1 tw="text-8xl font-semibold mb-3">{campaign?.company_name}</h1>
              }
              <div tw="flex mb-14">
                <h2 tw="text-5xl text-gray-600">{campaign?.campaign_name}</h2>
              </div>
              <p tw="text-4xl mb-5">{campaign?.commission_type === 'percentage' ? `${campaign?.commission_value}% commission on all paid referrals.` : `${priceString(campaign?.commission_value, campaign?.company_currency)} commission on all paid referrals.`}</p> 
            </div>
          :
            <div tw="flex flex-col items-center justify-center">
              <h1 tw="text-7xl font-semibold mb-3">Get started with Reflio</h1>
            </div>
        }
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}