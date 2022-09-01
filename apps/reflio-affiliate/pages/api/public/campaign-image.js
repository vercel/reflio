import { withOGImage } from 'next-api-og-image';
import { postData } from '@/utils/helpers';

const ogImageGenerate = async (companyHandle, campaignId) => {
  const { campaign } = await postData({
    url: `${process.env.NEXT_PUBLIC_AFFILIATE_SITE_URL}/api/public/campaign`,
    data: {
      "companyHandle": companyHandle ? companyHandle : null,
      "campaignId": campaignId ? campaignId : null
    }
  });

  return campaign;
};

export default withOGImage({
  template: {
    html: async ({companyHandle, campaignId}) => {

      const campaign = await ogImageGenerate(companyHandle, campaignId);

      return `<html>
        <head>
          <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet">
        </head>
        <body>
          <div class="flex flex-col items-center justify-center w-full h-full bg-gradient-to-b from-white to-gray-200">
          ${
            campaign?.company_image !== null ? 
              `<img alt="${campaign?.company_name} Logo" src="${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL+campaign?.company_image}" class="h-24 w-auto mx-auto mb-3"/>` 
            : 
              `<h1 class="text-7xl font-semibold mb-3">${campaign?.company_name}</h1>`
          }
            <div class="mb-14">
              <h2 class="text-4xl text-gray-600">${campaign?.campaign_name}</h2>
            </div>
            <p class="text-4xl mb-5">${campaign?.commission_type === 'percentage' ? `${campaign?.commission_value}% commission on all paid referrals.` : `${campaign?.company_currency}${campaign?.commission_value} commission on all paid referrals.`}</p> 
          </div>
        </body>
      </html>`
    }
  },
  cacheControl: 'public, max-age=604800, immutable',
  dev: {
    inspectHtml: false,
  }
})