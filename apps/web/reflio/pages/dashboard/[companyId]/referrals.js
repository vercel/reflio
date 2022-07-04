import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useUser, getReferrals } from '@/utils/useUser';
import { useCompany } from '@/utils/CompanyContext';
import { useAffiliate } from '@/utils/AffiliateContext';
import LoadingDots from '@/components/ui/LoadingDots';
import Button from '@/components/ui/Button'; 
import SEOMeta from '@/components/SEOMeta'; 
import {
  UserGroupIcon
} from '@heroicons/react/solid';

export default function ReferralsPage() {
  const router = useRouter();
  const { user, userFinderLoaded } = useUser();
  const { activeCompany } = useCompany();
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(false);
 
  if(referrals?.length === 0 && activeCompany?.company_id){
    getReferrals(activeCompany?.company_id, null).then(results => {
      if(results !== "error" && results?.data?.length){
        setReferrals(results);
      }

      if(results === "error"){
        console.warn("There was an error when getting data");
      }
    })
  }

  const paginatedResults = async () => {
    if(referrals?.count > referrals?.data?.length){
      setLoading(true);

      getReferrals(activeCompany?.company_id, referrals?.data[referrals?.data?.length-1]?.created).then(results => {
        if(results !== "error" && results?.data?.length){
          let newReferralsData = [...referrals?.data, ...results?.data]
          setReferrals({"data": newReferralsData, "count": referrals?.count});
        }
  
        if(results === "error"){
          console.warn("There was an error when getting data");
        }

        setLoading(false);
      })
    }
  }

  useEffect(() => {
    if(userFinderLoaded){
      if (!user) router.replace('/signin');
    }
  }, [userFinderLoaded, user, activeCompany]);

  return (
    <>
      <SEOMeta title="Referrals"/>
      <div className="mb-8">
        <div className="pt-10 wrapper flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl tracking-tight font-extrabold">Referrals</h1>
        </div>
      </div>
      <div className="wrapper">
        {
          activeCompany && referrals?.data ?
          referrals !== null && referrals?.data?.length > 0 ?
              <div>
                <div className="flex flex-col">
                  <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                      <div className="overflow-hidden shadow-md border-4 border-gray-300 rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300">
                          <thead className="bg-gray-200">
                            <tr>
                              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-6">
                                Referrer
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                                Campaign
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                                Commission Amount
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                                Revenue
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                                Status
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                                Date Created
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            {referrals?.data?.map((referral) => (
                              <tr key={referral?.referral_id}>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                  <div className="flex items-center">
                                    <div className="ml-4">
                                      <span>{referral?.affiliate_id}</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm">
                                  {
                                    referral?.campaign_id ?
                                      <a href={`/dashboard/${router?.query?.companyId}/campaigns/${referral?.campaign_id}`} className="font-bold underline">{referral?.campaign_id}</a>
                                    :
                                      <p className="font-semibold text-gray-600 italic">This campaign is no longer available.</p>
                                  }
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm">
                                  <p>{referral?.impressions}</p>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm">
                                  <p>$0</p>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm">
                                  {referral?.invite_email === 'manual' ? 'Public signup' : 'Manual invite'}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm">
                                  <span className={`${referral?.accepted === true ? 'bg-secondary text-white' : 'bg-gray-500 text-white'} inline-flex rounded-full px-3 py-1 text-xs font-semibold leading-5`}>
                                    {referral?.accepted === true ? 'Active' : 'Invited' }
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {
                        referrals?.count > referrals?.data?.length &&
                        <div className="mt-5 flex justify-center">
                          <Button
                            disabled={loading}
                            onClick={e=>{paginatedResults()}}
                            medium
                            gray
                          >
                            <span>{loading ? 'Loading...' : 'Load more'}</span>
                          </Button>
                        </div>
                      }
                    </div>
                  </div>
                </div>
              </div>
            :
              <div>
                <a
                  href={`/dashboard/${router?.query?.companyId}/affiliates/invite`}
                  className="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <UserGroupIcon className="w-10 h-auto mx-auto text-gray-600"/>
                  <span className="mt-2 block text-sm font-medium text-gray-600">Invite affiliates</span>
                </a>
              </div>
          :
            <LoadingDots/>
        }
      </div>
    </>
  );
}