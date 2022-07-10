import { Fragment } from 'react';
import { useUser, handleActiveCompany } from '@/utils/useUser';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { classNames } from '@/utils/helpers';
import { useCompany } from '@/utils/CompanyContext';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import {
  CreditCardIcon,
  TemplateIcon,
  CogIcon,
  TableIcon,
  ClipboardCheckIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  SparklesIcon
} from '@heroicons/react/outline';

export default function AdminNavItems() {
  const { signOut, planDetails } = useUser();
  const { activeCompany, userCompanyDetails } = useCompany();
  const router = useRouter();

  const navigation = [
    { name: 'Campaigns', href: `/dashboard/${activeCompany?.company_id}/campaigns`, icon: TemplateIcon },
    { name: 'Affiliates', href: `/dashboard/${activeCompany?.company_id}/affiliates`, icon: UserGroupIcon },
    { name: 'Referrals', href: `/dashboard/${activeCompany?.company_id}/referrals`, icon: SparklesIcon },
    { name: 'Sales & Commissions', href: `/dashboard/${activeCompany?.company_id}/commissions`, icon: CurrencyDollarIcon },
    { name: 'Setup', href: `/dashboard/${activeCompany?.company_id}/setup`, icon: ClipboardCheckIcon },
    { name: 'Company Settings', href: `/dashboard/${activeCompany?.company_id}/settings`, icon: CogIcon },
  ];

  const secondaryNavigation = [
    { name: 'Changelog', href: '/changelog' },
  ];

  const handleCompanySwitch = async (companyId) => {
    if(!companyId) return false;

    await handleActiveCompany(companyId).then((result) => {
      if(result === "success"){
        router.replace(`/dashboard/${companyId}`);
      }
    });
  };
  
  return(
    <>
      <nav className="mt-8 flex-1 flex flex-col overflow-y-auto" aria-label="Sidebar">
        <div className="px-4 space-y-1 pb-6">
          <Listbox onChange={value=>{handleCompanySwitch(value)}} value={activeCompany?.company_id}>
            {({ open }) => (
              <>
                <div className="relative">
                  <Listbox.Button className="relative w-full bg-white rounded-xl font-semibold pl-3 pr-10 py-3 flex text-left cursor-pointer focus:outline-none sm:text-sm border-2 border-gray-300">
                    <span className="relative w-5 h-5 rounded-full block mr-2">
                      {
                        activeCompany?.company_url &&
                        <Image src={'https://s2.googleusercontent.com/s2/favicons?domain='+activeCompany?.company_url+''} objectFit='contain' layout='fill' />
                      }
                    </span>
                    <span className="flex items-center truncate">
                      {activeCompany?.company_name}
                    </span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <SelectorIcon className="h-5 w-5" aria-hidden="true" />
                    </span>
                  </Listbox.Button>

                  <Transition
                    show={open}
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options
                      static
                      className="top-0 left-0 absolute rounded-lg z-20 w-full bg-white max-h-60 text-base overflow-auto focus:outline-none sm:text-sm border-4 border-primary-2 shadow-xl shadow-secondary"
                    >
                      {userCompanyDetails?.map((company) => (
                        <Listbox.Option
                          key={company?.company_id}
                          className={({ selected, active }) =>
                            classNames(
                              selected && 'bg-primary',
                              'cursor-pointer select-none relative py-3 px-5 border-b-2'
                            )
                          }
                          value={company?.company_id}
                        >
                          {({ selected, active }) => (
                            <>
                            <div className="flex">
                              <span className="relative w-5 h-5 rounded-full block mr-2">
                                {
                                  company?.display_image &&
                                  <Image src={company?.display_image} objectFit='contain' layout='fill' />
                                }
                              </span>
                              <span className={classNames(selected ? 'font-bold' : 'font-medium', 'flex items-center truncate')}>
                                {company?.company_name}
                              </span>
                            </div>

                              {selected ? (
                                <span
                                  className="absolute inset-y-0 left-0 flex items-center pl-3"
                                >
                                  <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                      <a href="/dashboard/add-company" className="block bg-gray-100 cursor-pointer select-none font-semibold relative py-3 px-5">
                        + Add Company
                      </a>
                    </Listbox.Options>
                  </Transition>
                </div>
              </>
            )}
          </Listbox>
        </div>
        <div className="p-5">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={classNames(
                router?.asPath?.includes(item.href) && 'bg-gray-300 border-gray-400 hover-opacity-100',
                'flex items-center p-2 text-lg font-semibold rounded-md border-2 border-transparent hover:opacity-80'
              )}
              aria-current={item.current ? 'page' : undefined}
            >
              <item.icon className="mr-4 flex-shrink-0 h-6 w-6" aria-hidden="true" />
              <span>{item.name}</span>
            </a>
          ))}
            <a
              href={`/dashboard/plan`}
              className={classNames(
                router?.asPath === `/dashboard/plan` && 'bg-gray-300 border-gray-400 hover-opacity-100',
                'flex items-center p-2 text-lg font-semibold rounded-md border-2 border-transparent hover:opacity-80'
              )}
            >
              <CreditCardIcon className="mr-4 flex-shrink-0 h-6 w-6" aria-hidden="true" />
              <span>{planDetails === 'free' ? 'Upgrade' : 'PRO Plan'}</span>
              {
                planDetails === 'free' &&
                <span className="py-1 px-3 text-xs bg-secondary text-white rounded-xl ml-2 uppercase font-semibold">Pro</span>
              }
            </a>
        </div>
        <div className="pt-3 mt-auto">
          <div className="px-4 space-y-1">
            {/* {secondaryNavigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={classNames(
                  router?.asPath === item.href && 'bg-secondary border-secondary-2 hover:bg-secondary-2 hover:opacity-100',
                  'items-center px-2 py-2 text-md font-semibold rounded-md border-2 border-transparent'
                )}
              >
                {item.name}
              </a>
            ))} */}
            <button
              onClick={() => signOut()}
              className={'items-center px-2 py-2 text-md font-semibold rounded-md'}
            >
              Sign out
            </button>
            <a className="items-center px-2 py-2 text-md font-semibold rounded-md" href={process.env.NEXT_PUBLIC_AFFILIATE_SITE_URL} target="_blank">Affiliate Dashboard</a>
          </div>
        </div>
      </nav>
    </>
  )
};