import { useRouter } from 'next/router';
import { useCompany } from '@/utils/CompanyContext';
import { deleteAffiliate } from '@/utils/useUser';
import { useAffiliate } from '@/utils/AffiliateContext';
import LoadingTile from '@/components/LoadingTile';
import Button from '@/components/Button'; 
import { SEOMeta } from '@/templates/SEOMeta'; 
import {
  UserGroupIcon
} from '@heroicons/react/solid';
import {
  TrashIcon
} from '@heroicons/react/outline';
import ReactTooltip from 'react-tooltip';
import { priceStringDivided } from 'utils/helpers';
import setupStepCheck from '@/utils/setupStepCheck';

export default function InnerDashboardPage() {
  setupStepCheck('light');
  
  const router = useRouter();
  const { activeCompany } = useCompany();
  const { mergedAffiliateDetails } = useAffiliate();

  const handleDelete = async (affiliateId) => {
    if (window.confirm('Are you sure you want to delete this affiliate? This decision is irreversible')){
      await deleteAffiliate(affiliateId).then((result) => {
        if(result === "success"){
          router.reload();
        } else {
          toast.error('There was an error when deleting this affiliate. Please try again later.');
        }
      });
    }
  };

  return (
    <>
      <SEOMeta title="Affiliates"/>
      <div className="mb-8">
        <div className="pt-10 wrapper flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl tracking-tight font-extrabold">Affiliates</h1>
          <Button
            href={`/dashboard/${router?.query?.companyId}/affiliates/invite`}
            medium
            primary
          >
            <span>Invite affiliates</span>
          </Button>
        </div>
      </div>
      <div className="wrapper">
        {
          activeCompany && mergedAffiliateDetails ?
          mergedAffiliateDetails !== null && mergedAffiliateDetails?.length > 0 ?
              <div>
                <div className="flex flex-col">
                  <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                      <div className="overflow-hidden shadow-md border-4 border-gray-300 rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300">
                          <thead className="bg-gray-200">
                            <tr>
                              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-6">
                                User
                              </th>
                              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-6">
                                Affiliate ID
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                                Campaign
                              </th>
                              <th data-tip="Impressions are counted and tracked when a cookie was successfully set on the users device." scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                                Impressions
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                                Revenue Contributed
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                                Signup Method
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                                Status
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            {mergedAffiliateDetails?.map((affiliate) => (
                              <tr key={affiliate?.affiliate_id}>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                  <div className="flex items-center">
                                    <div className="ml-4">
                                      <span>{affiliate?.details?.email ?? affiliate?.invite_email}</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm">
                                  <p>{affiliate?.affiliate_id}</p>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm">
                                  {
                                    affiliate?.campaign_name ?
                                      <a href={`/dashboard/${router?.query?.companyId}/campaigns/${affiliate?.campaign_id}`} className="font-bold underline">{affiliate?.campaign_name}</a>
                                    :
                                      <p className="font-semibold text-gray-600 italic">This campaign  was either deleted or no longer exists.</p>
                                  }
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm">
                                  <p>{affiliate?.impressions}</p>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm">
                                  <p>{priceStringDivided(affiliate?.commissions_value ?? 0, activeCompany?.company_currency)}</p>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm">
                                  {affiliate?.invite_email === 'manual' ? 'Public signup' : 'Manual invite'}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm">
                                  <span className={`${affiliate?.accepted === true ? 'bg-secondary text-white' : 'bg-gray-500 text-white'} inline-flex rounded-full px-3 py-1 text-xs font-semibold leading-5`}>
                                    {affiliate?.accepted === true ? 'Active' : 'Invited' }
                                  </span>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm">
                                  <button onClick={e=>{handleDelete(affiliate?.affiliate_id)}}>
                                    <TrashIcon className="w-5 h-auto"/>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <ReactTooltip/>
                      </div>
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
                  <span className="mt-2 block text-sm font-medium text-gray-600">Invite your first affiliates</span>
                </a>
              </div>
          :
            <LoadingTile/>
        }
      </div>
    </>
  );
}