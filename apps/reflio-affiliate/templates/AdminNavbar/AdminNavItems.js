import { Fragment } from 'react';
import { useUser } from '@/utils/useUser';
import { useRouter } from 'next/router';
import { classNames } from '@/utils/helpers';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import {
  CogIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  TemplateIcon,
  SparklesIcon
} from '@heroicons/react/outline';

export const AdminNavItems = () => {
  const { signOut } = useUser();
  const router = useRouter();

  const navigation = [
    { name: 'Dashboard', href: `/dashboard`, icon: TemplateIcon },
    { name: 'My Campaigns', href: `/dashboard/campaigns`, icon: UserGroupIcon },
    { name: 'Referrals', href: `/dashboard/referrals`, icon: SparklesIcon },
    { name: 'Commissions', href: `/dashboard/commissions`, icon: CurrencyDollarIcon },
    // { name: 'Campaign Finder', href: `/dashboard/campaigns/finder`, icon: SearchIcon },
    { name: 'Settings', href: `/dashboard/settings`, icon: CogIcon }
  ];

  const secondaryNavigation = [
    { name: 'Changelog', href: '/changelog' },
  ];
  
  return(
    <>
      <nav className="mt-8 flex-1 flex flex-col overflow-y-auto" aria-label="Sidebar">
        <div className="p-5">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={classNames(
                router?.asPath === item.href && 'bg-secondary border-secondary-2 hover:bg-secondary-2 hover-opacity-100 text-white',
                'flex items-center p-2 text-lg font-semibold rounded-md border-2 border-transparent hover:opacity-70'
              )}
              aria-current={item.current ? 'page' : undefined}
            >
              <item.icon className="mr-4 flex-shrink-0 h-6 w-6" aria-hidden="true" />
              <span>{item.name}</span>
            </a>
          ))}
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
          </div>
        </div>
      </nav>
    </>
  )
};

export default AdminNavItems;