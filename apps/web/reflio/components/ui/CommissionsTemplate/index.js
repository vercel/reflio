import { Fragment, useState } from 'react';
import { getSales } from '@/utils/useUser';
import { useCompany } from '@/utils/CompanyContext';
import LoadingTile from '@/components/ui/LoadingTile';
import Button from '@/components/ui/Button'; 
import {
  EmojiSadIcon
} from '@heroicons/react/solid';
import { UTCtoString, priceStringDivided, checkUTCDateExpired, classNames } from '@/utils/helpers';
import ReactTooltip from 'react-tooltip';
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'

const CommissionsTemplate = ({ page }) => {
  const { activeCompany } = useCompany();
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);

  const sortOptions = [
    { name: 'All Commissions', href: `/dashboard/${activeCompany?.company_id}/commissions` },
    { name: 'Unpaid', href: `/dashboard/${activeCompany?.company_id}/commissions/unpaid` },
    { name: 'Paid', href: `/dashboard/${activeCompany?.company_id}/commissions/paid` },
  ];
 
  if(commissions?.length === 0 && activeCompany?.company_id){
    getSales(activeCompany?.company_id, null, page).then(results => {
      if(results !== "error" && results?.data?.length){
        setCommissions(results);
      }

      if(results === "error"){
        console.warn("There was an error when getting data");
      }

      if(results?.data?.length === 0){
        setCommissions({"data": [], "count": 0});
      }
    })
  }

  const paginatedResults = async () => {
    if(commissions?.count > commissions?.data?.length){
      setLoading(true);

      getSales(activeCompany?.company_id, commissions?.data[commissions?.data?.length-1]?.created, page).then(results => {
        if(results !== "error" && results?.data?.length){
          let newCommissionsData = [...commissions?.data, ...results?.data]
          setCommissions({"data": newCommissionsData, "count": commissions?.count});
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
      <div className="mb-8">
        <div className="pt-10 wrapper">
          <h1 className="text-2xl sm:text-3xl tracking-tight font-extrabold mb-3">{page === 'index' ? 'All' : page === 'unpaid' ? 'Unpaid' : page === 'paid' && 'Paid'} Sales & Commissions {commissions?.count > 0 && `(${commissions?.count})`}</h1>
          <p>Commissions are generated when your affiliates send you a paying customer.</p>
        </div>
      </div>
      <div className="wrapper">
        {
          commissions && commissions?.data?.length > 0 ?
              <div>
                <div className="mb-5">
                  <Menu as="div" className="relative z-10 inline-block text-left">
                    <div>
                      <Menu.Button className="group inline-flex items-center justify-center text-sm bg-white rounded-xl py-3 px-5 border-4 border-gray-300">
                        <span>Filter</span>
                        <ChevronDownIcon
                          className="flex-shrink-0 ml-1 h-4 w-4"
                          aria-hidden="true"
                        />
                      </Menu.Button>
                    </div>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="origin-top-left absolute left-0 z-10 mt-2 w-40 rounded-md shadow-2xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                          {sortOptions.map((option) => (
                            <Menu.Item key={option}>
                              {({ active }) => (
                                <a
                                  href={option.href}
                                  className={classNames(
                                    active ? 'bg-gray-100' : '',
                                    'block px-4 py-3 text-gray-900'
                                  )}
                                >
                                  {option.name}
                                </a>
                              )}
                            </Menu.Item>
                          ))}
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
                {
                  checkedItems.length > 0 &&
                  <div className="flex items-center justify-end">
                    
                  </div>
                }
                <div className="flex flex-col">
                  <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                      <div className="overflow-hidden shadow-md border-4 border-gray-300 rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300">
                          <thead className="bg-gray-200">
                            <tr>
                              <th scope="col" className="pr-3 sm:pl-6 px-3 py-3.5 text-left text-sm font-semibold">
                                <input
                                  id="campaign_public"
                                  name="campaign_public"
                                  type="checkbox"
                                  className={`disabled:bg-gray-200 focus:ring-primary h-7 w-7 text-secondary border-2 border-gray-300 rounded-lg cursor-pointer`}
                                  onClick={(e) => {
                                    setCheckedItems(checkedItems === 'all' ? [] : 'all');
                                  }} 
                                />
                              </th>
                              <th data-tip="The total amount received, after any deductions for refunds and discounts." scope="col" className="px-3 py-3.5 text-sm text-left font-semibold">
                                Sale Amount
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                                Commission Value
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
                                Date Created
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white text-sm">
                            {commissions?.data?.map((sale) => (
                              <tr key={sale?.commission_id}>
                                <td className="whitespace-nowrap pl-4 pr-3  text-sm">
                                  <div className="flex items-center h-5">
                                    <input
                                      disabled={sale?.paid_at !== null || checkUTCDateExpired(sale?.commission_due_date) === false}
                                      id="campaign_public"
                                      name="campaign_public"
                                      type="checkbox"
                                      className={`disabled:bg-gray-200 focus:ring-primary h-7 w-7 text-secondary border-2 border-gray-300 rounded-lg cursor-pointer`}
                                      onClick={(e) => {
                                        setCheckedItems([
                                          ...checkedItems,
                                          sale
                                        ]);
                                      }} 
                                      checked={checkedItems === 'all' && true}
                                    />
                                  </div>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm sm:pl-6">
                                  <span>{priceStringDivided(sale?.commission_sale_value, activeCompany?.company_currency)}</span>
                                </td>
                                <td className={`whitespace-nowrap px-3 py-4 font-semibold ${checkUTCDateExpired(sale?.commission_due_date) === true && 'text-red-500'}`}>
                                  <span>{priceStringDivided(sale?.commission_total, activeCompany?.company_currency)}</span>
                                </td>
                                <td className="px-3 py-4 text-sm max-w-xs break-all">
                                  {sale?.commission_description ? sale?.commission_description : 'N/A'}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4">
                                  <span>{sale?.affiliate?.invite_email}</span>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm">
                                  {sale?.referral_id}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm">
                                  <div data-tip={sale?.created}>{UTCtoString(sale?.created)}</div>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm">
                                  <div data-tip={`${sale?.paid_at !== null ? 'Paid at '+sale?.paid_at+'' : checkUTCDateExpired(sale?.commission_due_date) === true ? 'Unpaid' : 'Not valid to be paid out yet, due '+sale?.commission_due_date+''}`} className={`${sale?.paid_at !== null ? 'bg-secondary-2 text-white' : checkUTCDateExpired(sale?.commission_due_date) === true ? 'bg-red-500 text-white' : 'bg-gray-400 text-gray-900'} 'bg-gray-400 text-gray-900'} inline-flex rounded-full px-3 py-1 text-xs font-semibold leading-5`}>
                                    {sale?.paid_at !== null ? 'Paid' : checkUTCDateExpired(sale?.commission_due_date) === true ? 'Unpaid' : 'Not payable yet'}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <ReactTooltip/>
                      </div>
                      <div className="mt-2">
                        <span className="text-xs">{`Showing ${commissions?.data?.length} of ${commissions?.count} total commissions.`}</span>
                      </div>
                      {
                        commissions?.count > commissions?.data?.length &&
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
            : commissions?.data?.length === 0 ?
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
}

export default CommissionsTemplate;