import { useRouter } from 'next/router';
import { useCompany } from '@/utils/CompanyContext';
import { useCampaign } from '@/utils/CampaignContext';
import LoadingTile from '@/components/LoadingTile';
import { SEOMeta } from '@/templates/SEOMeta'; 
import Button from '@/components/Button'; 
import { CopyToClipboard } from 'react-copy-to-clipboard';
import toast from 'react-hot-toast';
import {
  TemplateIcon
} from '@heroicons/react/solid';
import { priceString } from 'utils/helpers';

export default function CampaignsPage() {
  const router = useRouter();
  const { activeCompany } = useCompany();
  const { userCampaignDetails } = useCampaign();

  const generateInviteUrl = (activeCampaign, companyHandle, campaignId) => {
    if(activeCampaign === true){
      return `${process.env.NEXT_PUBLIC_AFFILIATE_SITE_URL}/invite/${companyHandle}`;
    } else {
      return `${process.env.NEXT_PUBLIC_AFFILIATE_SITE_URL}/invite/${companyHandle}/${campaignId}`;
    }
  };
  
  return (
    <>
      <SEOMeta title="Campaigns"/>
      <div className="mb-12">
        <div className="pt-10 wrapper flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl tracking-tight font-extrabold">Campaigns</h1>
          <Button
            href={`/dashboard/${router?.query?.companyId}/campaigns/new`}
            medium
            primary
          >
            <span>Create campaign</span>
          </Button>
        </div>
      </div>
      {/* <div className="mb-12">
        <LoadingDots/>
      </div> */}
      <div className="wrapper">
        {
          activeCompany && userCampaignDetails ?
            userCampaignDetails !== null && userCampaignDetails?.length > 0 ?
              <div>
                <div className="flex flex-col">
                  <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                      <div className="overflow-hidden shadow-md rounded-lg border-4 border-gray-300">
                        <table className="min-w-full divide-y divide-gray-300">
                          <thead className="bg-gray-200">
                            <tr className="divide-x-4 divide-gray-300">
                              <th scope="col" className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold sm:pl-6">
                                Campaign
                              </th>
                              <th scope="col" className="px-4 py-3.5 text-sm font-semibold text-center">
                                Affiliates
                              </th>
                              <th scope="col" className="px-4 py-3.5 text-sm font-semibold text-center">
                                Revenue
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            {userCampaignDetails?.map((campaign) => (
                              <tr key={campaign?.campaign_id} className="divide-x-4 divide-gray-200">
                                <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium sm:pl-6">
                                  {
                                    campaign?.default_campaign === true &&
                                    <div className="inline-flex items-center px-4 py-1 rounded-full text-xs font-semibold bg-secondary text-white mb-2">
                                      Default Campaign
                                    </div>
                                  }
                                  <p className="text-xl mb-2 font-semibold"><a className="underline" href={`/dashboard/${router?.query?.companyId}/campaigns/${campaign?.campaign_id}`}>{campaign?.campaign_name}</a></p>
                                  <p className="text-md">{campaign?.commission_type === 'percentage' ? `${campaign?.commission_value}% commission on all paid referrals` : `${priceString(campaign?.commission_value, activeCompany?.company_currency)} commission on all paid referrals`}</p>
                                  <div className="mt-3">
                                    <p className="text-gray-500">
                                      <span>New affiliates can join at&nbsp;</span>
                                      <CopyToClipboard text={generateInviteUrl(campaign?.default_campaign, activeCompany?.company_handle, campaign?.campaign_id)} onCopy={() => toast.success('URL copied to clipboard')}>
                                        <button className="font-semibold underline" href={generateInviteUrl(campaign?.default_campaign, activeCompany?.company_handle, campaign?.campaign_id)}>{generateInviteUrl(campaign?.default_campaign, activeCompany?.company_handle, campaign?.campaign_id)}</button>
                                      </CopyToClipboard>
                                    </p>
                                  </div> 
                                </td>
                                <td className="whitespace-nowrap p-4 text-sm text-center">
                                  <a href="#" className="underline font-semibold">0 affiliates</a>
                                </td>
                                <td className="whitespace-nowrap p-4 text-sm text-center">$0 USD</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            :
              <div>
                <a
                  href={`/dashboard/${router?.query?.companyId}/setup/campaign`}
                  className="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <TemplateIcon className="w-10 h-auto mx-auto text-gray-600"/>
                  <span className="mt-2 block text-sm font-medium text-gray-600">Create a campaign</span>
                </a>
              </div>
          :
            <LoadingTile/>
        }
      </div>
    </>
  );
}