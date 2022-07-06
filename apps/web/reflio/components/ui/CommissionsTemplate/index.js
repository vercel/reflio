import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useUser, getSales } from '@/utils/useUser';
import { useCompany } from '@/utils/CompanyContext';
import LoadingDots from '@/components/ui/LoadingDots';
import Button from '@/components/ui/Button'; 
import {
  EmojiSadIcon
} from '@heroicons/react/solid';
import { UTCtoString, priceStringDivided } from '@/utils/helpers';
import ReactTooltip from 'react-tooltip';

const CommissionsTemplate = ({ edit, setupMode }) => {
  const router = useRouter();
  const { activeCompany } = useCompany();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
 
  if(sales?.length === 0 && activeCompany?.company_id){
    getSales(activeCompany?.company_id, null).then(results => {
      if(results !== "error" && results?.data?.length){
        setSales(results);
      }

      if(results === "error"){
        console.warn("There was an error when getting data");
      }
    })
  }

  const paginatedResults = async () => {
    if(sales?.count > sales?.data?.length){
      setLoading(true);

      getReferrals(activeCompany?.company_id, sales?.data[sales?.data?.length-1]?.created).then(results => {
        if(results !== "error" && results?.data?.length){
          let newSalesData = [...sales?.data, ...results?.data]
          setSales({"data": newSalesData, "count": sales?.count});
        }
  
        if(results === "error"){
          console.warn("There was an error when getting data");
        }

        setLoading(false);
      })
    }
  }

  return (
    <>
      <div className="wrapper">
        {
          activeCompany && sales ?
          sales !== null && sales?.data?.length > 0 ?
              <div>
                <div className="flex flex-col">
                  <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                      <div className="overflow-hidden shadow-md border-4 border-gray-300 rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300">
                          <thead className="bg-gray-200">
                            <tr>
                              <th data-tip="The total amount received, after any deductions for refunds and discounts." scope="col" className="pr-3 text-sm sm:pl-6 px-3 py-3.5 text-left font-semibold">
                                Sale Amount
                                <ReactTooltip/>
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                                Products
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                                Referrer
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                                Referral ID
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                                Campaign
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                                Date Created
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white text-sm">
                            {sales?.data?.map((sale) => (
                              <tr key={sale?.referral_id}>
                                <td className="whitespace-nowrap pl-4 pr-3 text-sm sm:pl-6 font-semibold">
                                  <span>{priceStringDivided(sale?.commission_sale_value, activeCompany?.company_currency)}</span>
                                </td>
                                <td className="px-3 py-4 text-sm max-w-xs break-all">
                                  {sale?.commission_description}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4">
                                  <span>{sale?.affiliate?.invite_email}</span>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm">
                                  {sale?.referral_id}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm">
                                  {
                                    sale?.campaign?.campaign_name ?
                                      <a href={`/dashboard/${router?.query?.companyId}/campaigns/${sale?.campaign_id}`} className="font-bold underline">{sale?.campaign?.campaign_name}</a>
                                    :
                                      <p className="font-semibold text-gray-600 italic">Campaign no longer available.</p>
                                  }
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm">
                                  <div data-tip={sale?.created}>{UTCtoString(sale?.created)}</div>
                                  <ReactTooltip/>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="mt-2">
                        <span className="text-xs">{`Showing ${sales?.data?.length} of ${sales?.count} total sales.`}</span>
                      </div>
                      {
                        sales?.count > sales?.data?.length &&
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
                      }
                    </div>
                  </div>
                </div>
              </div>
            :
              <div>
                <div
                  className="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <EmojiSadIcon className="w-10 h-auto mx-auto text-gray-600"/>
                  <span className="mt-2 block text-sm font-medium text-gray-600">You have no sales yet.</span>
                </div>
              </div>
          :
            <LoadingDots/>
        }
      </div>
    </>
  );
}

export default CommissionsTemplate;