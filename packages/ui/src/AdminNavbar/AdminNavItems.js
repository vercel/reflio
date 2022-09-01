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
  ClipboardCheckIcon,
  UserGroupIcon,
  ChartBarIcon,
  SparklesIcon,
  ChatAltIcon,
  BookOpenIcon,
  MapIcon,
  SupportIcon
} from '@heroicons/react/outline';
import Link from 'next/link';

export const AdminNavItems = () => {
  const { signOut } = useUser();
  const { activeCompany, userCompanyDetails } = useCompany();
  const router = useRouter();

  const manageNavigation = [
    { name: 'Campaigns', href: `/dashboard/${activeCompany?.company_id}/campaigns`, icon: TemplateIcon },
    { name: 'Affiliates', href: `/dashboard/${activeCompany?.company_id}/affiliates`, icon: UserGroupIcon },
    { name: 'Referrals', href: `/dashboard/${activeCompany?.company_id}/referrals`, icon: SparklesIcon },
    { name: 'Sales & Commissions', href: `/dashboard/${activeCompany?.company_id}/commissions`, icon: ChartBarIcon }
  ];

  const settingsNavigation = [
    { name: 'Setup', href: `/dashboard/${activeCompany?.company_id}/setup`, icon: ClipboardCheckIcon },
    { name: 'Company Settings', href: `/dashboard/${activeCompany?.company_id}/settings`, icon: CogIcon },
    { name: 'Billing / Plans', href: `/dashboard/billing`, icon: CreditCardIcon }
  ];

  const navItemClass = 'flex items-center py-1.5 px-2 my-1 text-base font-semibold rounded-lg hover:bg-gray-300';

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
                        <Image src={'https://s2.googleusercontent.com/s2/favicons?domain='+activeCompany?.company_url+''} objectFit='contain' layout='fill' alt={`${activeCompany?.company_name} Image`} />
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
                              <span className={classNames(selected ? 'font-bold' : 'font-medium', 'flex items-center truncate pl-4')}>
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
                      <Link 
                        passHref 
                        href="/dashboard/add-company"
                      >
                        <a className="block bg-gray-200 cursor-pointer select-none font-semibold relative py-3 px-5 -mt-1">
                          + Add Company
                        </a>
                      </Link>
                    </Listbox.Options>
                  </Transition>
                </div>
              </>
            )}
          </Listbox>
        </div>
        <div className="px-5 py-2">
          <p className="px-2 uppercase text-xs font-semibold text-gray-500 tracking-wide mb-2">Manage</p>
          {manageNavigation.map((item) => (
            <Link
              passHref
              key={item.name}
              href={item.href}
              aria-current={item.current ? 'page' : undefined}
            >
              <a
                className={classNames(
                  router?.asPath?.includes(item.href) && 'bg-gray-300',
                  navItemClass
                )}
              >
                <item.icon className="mr-2 flex-shrink-0 h-5 w-5" aria-hidden="true" />
                <span>{item.name}</span>
              </a>
            </Link>
          ))}
        </div>
        <div className="px-5 py-2">
          <p className="px-2 uppercase text-xs font-semibold text-gray-500 tracking-wide mb-2">Settings</p>
          {settingsNavigation.map((item) => (
            <Link
              passHref
              key={item.name}
              href={item.href}
              aria-current={item.current ? 'page' : undefined}
            >
              <a
                className={classNames(
                  router?.asPath?.includes(item.href) && 'bg-gray-300',
                  navItemClass
                )}
              >
                <item.icon className="mr-2 flex-shrink-0 h-5 w-5" aria-hidden="true" />
                <span>{item.name}</span>
              </a>
            </Link>
          ))}
        </div>
        <div className="px-5 py-2">
          <p className="px-2 uppercase text-xs font-semibold text-gray-500 tracking-wide mb-2">Resources</p>
          <Link
            passHref
            href="https://reflio.com/resources"
          >
            <a
              className={classNames(
                navItemClass
              )} 
              rel="noreferrer"
              target="_blank"
            >               
              <BookOpenIcon className="mr-2 flex-shrink-0 h-5 w-5" aria-hidden="true" />
              <span>Docs & Guides</span>
            </a>
          </Link>
          <Link
            passHref
            href="https://reflio.canny.io/"
          >
            <a
              className={classNames(
                navItemClass
              )} 
              rel="noreferrer"
              target="_blank"
            >               
              <MapIcon className="mr-2 flex-shrink-0 h-5 w-5" aria-hidden="true" />
              <span>Roadmap</span>
            </a>
          </Link>
          <Link
            passHref
            href="https://reflio.canny.io/feature-requests"
          >
            <a
              className={classNames(
                navItemClass
              )} 
              rel="noreferrer"
              target="_blank"
            >               
              <SupportIcon className="mr-2 flex-shrink-0 h-5 w-5" aria-hidden="true" />
              <span>Give Feedback</span>
            </a>
          </Link>
          <button
            onClick={e=>{$crisp.push(['do', 'chat:open'])}}
            className={classNames(
              navItemClass,
              'w-full'
            )}
          >
            <ChatAltIcon className="mr-2 flex-shrink-0 h-5 w-5" aria-hidden="true" />
            <span>Live Support</span>
          </button>
        </div>
        <div className="pt-3 mt-auto border-t-4 border-gray-300">
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
            <a className="items-center px-2 py-2 text-md font-semibold rounded-md" href={process.env.NEXT_PUBLIC_AFFILIATE_SITE_URL} target="_blank" rel="noreferrer">Affiliate Dashboard</a>
          </div>
        </div>
      </nav>
    </>
  )
};

export default AdminNavItems;