import { useState, useEffect } from 'react';
import { useUser } from '@/utils/useUser';
import { postData } from '@/utils/helpers';
import LoadingTile from '@/components/LoadingTile';
import SEOMeta from '@/templates/SEOMeta';
import {
  EmojiSadIcon
} from '@heroicons/react/solid';
import { UTCtoString, priceStringDivided } from '@/utils/helpers';
import ReactTooltip from 'react-tooltip';

const CommissionsPage = () => {
  const { user, userFinderLoaded, session } = useUser();
  const [commissions, setCommissions] = useState(null);
  const [loadingCommissions, setLoadingCommissions] = useState(false);

  const affiliateCommissions = async () => {    
    try {
      const { commissionsData } = await postData({
        url: '/api/affiliate/commissions',
        token: session.access_token
      });

      setCommissions(commissionsData);
      
    } catch (error) {
      console.log(error)
    }
  };

  console.log("commissions:")
  console.log(commissions)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (userFinderLoaded && user && commissions === null && loadingCommissions === false) {
      setLoadingCommissions(true);
      affiliateCommissions();
    }
  });

  return (
    <>
      <SEOMeta title="Commissions"/>
      <div className="mb-8">
        <div className="pt-10 wrapper">
          <h1 className="text-2xl sm:text-3xl tracking-tight font-extrabold mb-3">Commissions {commissions?.count > 0 && `(${commissions?.count})`}</h1>
          <p>Commissions are created when your referral becomes a paying customer. You are then paid a percentage of the overal amount paid, or a fixed amount, depending on the reward of the affiliate campaign which you joined.</p>
        </div>
      </div>
      <div className="wrapper">
        {
          commissions !== null && commissions?.length > 0 ?
              <div>
                <div className="flex flex-col">
                  <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                      <div className="overflow-hidden shadow-md border-4 border-gray-300 rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300">
                          <thead className="bg-gray-200">
                            <tr>
                              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-6">
                                Referral ID
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                                Campaign
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                                Commission Amount
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                                Status
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                                Date Created
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white text-sm ">
                            {commissions?.map((commission) => (
                              <tr key={commission?.referral_id}>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                  <span>{commission?.referral_id}</span>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm">
                                  {
                                    commission?.campaign_name ?
                                      <p>{commission?.campaign_name}</p>
                                    :
                                      <p className="text-gray-600 italic">This campaign is no longer available.</p>
                                  }
                                </td>
                                <td data-tip={`Total sale amount: ${priceStringDivided(commission?.commission_sale_value, commission?.company_currency)}`} className="whitespace-nowrap px-3 py-4 text-sm">
                                  {priceStringDivided(commission?.commission_total, commission?.company_currency)}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm">
                                  {
                                    commission?.paid_at !== null ?
                                      <div className={`bg-green-500 text-white inline-flex rounded-full px-3 py-1 text-xs font-semibold leading-5`}>
                                        Paid
                                      </div>
                                    :
                                      <div data-tip={`Eligible to be paid at ${UTCtoString(commission?.commission_due_date)}`} className={`${commission?.payout_eligible === true ? 'bg-orange-400 text-orange-900' : 'bg-gray-400 text-gray-900' } inline-flex rounded-full px-3 py-1 text-xs font-semibold leading-5`}>
                                        {commission?.payout_eligible === true ? 'Eligible' : 'Pending'}
                                      </div>
                                  }
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm">
                                  <div data-tip={commission?.created}>{UTCtoString(commission?.created)}</div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <ReactTooltip/>
                      </div>
                      <div className="mt-2">
                        <span className="text-xs">{`Showing ${commissions?.length} of ${commissions?.length} total commissions.`}</span>
                      </div>
                      {/* {
                        referrals?.count > referrals?.data?.length &&
                        <div className="mt-8 flex justify-center">
                          <Button
                            disabled={loading}
                            onClick={e=>{paginatedResults()}}
                            small
                            gray
                          >
                            <span>{loading ? 'Loading...' : 'Load more'}</span>
                          </Button>
                        </div>
                      } */}
                    </div>
                  </div>
                </div>
              </div>
            :
            commissions?.length === 0 ?
              <div>
                <div
                  className="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <EmojiSadIcon className="w-10 h-auto mx-auto text-gray-600"/>
                  <span className="mt-2 block text-sm font-medium text-gray-600">You have no commissions yet.</span>
                </div>
              </div>
          :
            <LoadingTile/>
        }
      </div>
    </>
  );
};

export default CommissionsPage;