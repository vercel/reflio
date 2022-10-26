/* eslint-disable @next/next/no-img-element */
import { useUserAffiliate } from '@/utils/UserAffiliateContext';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import toast from 'react-hot-toast';
import Button from '@/components/Button'; 
import { priceString, priceStringDivided } from '@/utils/helpers';
import LoadingDots from './LoadingDots';

const CampaignsList = (props) => {
  const { userAffiliateDetails, referralDetails } = useUserAffiliate();

  return(
    <div className="wrapper">
      <div className="mb-5">
        <h2 className="text-2xl sm:text-3xl tracking-tight font-extrabold">My Campaigns</h2>
      </div> 
      <div>
        {
          userAffiliateDetails !== null && userAffiliateDetails?.length > 0 ?
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
                            <th scope="col" className="px-4 py-3.5 text-center text-sm font-semibold">
                              Company
                            </th>
                            <th scope="col" className="px-4 py-3.5 text-center text-sm font-semibold">
                              Impressions
                            </th>
                            <th scope="col" className="px-4 py-3.5 text-center text-sm font-semibold">
                              Referrals
                            </th>
                            <th scope="col" className="px-4 py-3.5 text-center text-sm font-semibold ">
                              Revenue Earned
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {userAffiliateDetails?.filter(campaign=>campaign?.campaign_valid !== false).map((campaign) => (
                            <tr key={campaign?.campaign_id} className="divide-x-4 divide-gray-200">
                              <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium sm:pl-6">
                                <div className="flex items-center">
                                  <>
                                    <div>
                                      {
                                        campaign?.company_image !== null &&
                                          <img alt="Logo" src={process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL+campaign?.company_image} className="h-14 w-14 object-contain mr-4"/>
                                      }
                                    </div>
                                    {
                                      campaign?.campaign_valid !== false &&
                                      <div>
                                        <p className="text-xl mb-2 font-semibold">{campaign?.campaign_name}</p>
                                        <p className="text-md">{campaign?.commission_type === 'percentage' ? `${campaign?.commission_value}% commission on all paid referrals` : `${priceString(campaign?.commission_value, campaign?.company_currency)} commission on all paid referrals`}</p> 
                                      </div>
                                    }
                                  </>
                                </div>
                                <div className="mt-3">
                                  <p className="text-gray-500">
                                    <span>Your referral link:&nbsp;</span>
                                    <CopyToClipboard text={`https://${campaign?.company_url}?via=${campaign?.referral_code ? campaign?.referral_code : campaign?.affiliate_id}`} onCopy={() => toast.success('URL copied to clipboard')}>
                                      <button className="font-semibold underline text-gray-800" href={`https://${campaign?.company_url}?via=${campaign?.referral_code ? campaign?.referral_code : campaign?.affiliate_id}`}>{`https://${campaign?.company_url}?via=${campaign?.referral_code ? campaign?.referral_code : campaign?.affiliate_id}`}</button>
                                    </CopyToClipboard>
                                  </p>
                                  <Button
                                    primary
                                    small
                                    href={`/dashboard/campaigns/${campaign?.affiliate_id}/code`}
                                    className="mt-4"
                                  >
                                    Edit referral code
                                  </Button>
                                </div> 
                                <p className="text-gray-700 bg-gray-100 border-2 border-gray-200 p-3 rounded-xl mt-4 break-all text-sm">Tip: You can link to any page, just add <span className="font-bold text-secondary-2">?via={campaign?.referral_code ? campaign?.referral_code : campaign?.affiliate_id}</span> to the end of the URL to track your referral.</p>
                              </td>
                              <td className="whitespace-nowrap p-4 text-sm font-semibold text-center">{campaign?.company_name}</td>
                              <td className="whitespace-nowrap p-4 text-sm font-semibold text-center">{campaign?.impressions}</td>
                              <td className="whitespace-nowrap p-4 text-sm font-semibold text-center">
                                {`${campaign?.campaign_referrals} referrals`}
                              </td>
                              <td className="whitespace-nowrap p-4 text-sm font-semibold text-center">{priceStringDivided(campaign?.commissions_value ?? 0, campaign?.company_currency)}</td>
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
          userAffiliateDetails === null ?
            <div>
              <LoadingDots/>
            </div>
          : userAffiliateDetails?.length === 0 &&
            <div>
              <p>You haven't joined any campaigns.</p>
            </div>
        }
      </div>
    </div>
  );
}

export default CampaignsList;