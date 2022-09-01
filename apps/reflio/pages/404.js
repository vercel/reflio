/* This example requires Tailwind CSS v2.0+ */
import { ChevronRightIcon } from '@heroicons/react/solid'
import { BookOpenIcon, CurrencyDollarIcon, TemplateIcon } from '@heroicons/react/outline'

const links = [
  { title: 'Dashboard', href: '/dashboard', description: 'Your dashboard to control campaigns, affiliates and commissions.', icon: TemplateIcon },
  { title: 'Pricing', href: '/pricing', description: 'View our different pricing plans and see which one most suits your business.', icon: CurrencyDollarIcon },
  { title: 'Resources', href: '/resources', description: 'Learn how to integrate Reflio into your website', icon: BookOpenIcon }
];

export default function FourOhFour() {
  return (
    <div className="bg-white">
      <div className="wrapper wrapper-sm py-24">
        <div className="text-center">
          <p className="text-base font-semibold text-secondary">404</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            This page does not exist.
          </h1>
          <p className="mt-2 text-lg">The page you are looking for could not be found.</p>
        </div>
        <div className="mt-12">
          <h2 className="text-base font-semibold">Popular pages</h2>
          <ul role="list" className="mt-4 divide-y divide-gray-200 border-t border-b border-gray-200">
            {links.map((link, linkIdx) => (
              <li key={linkIdx} className="relative flex items-start space-x-4 py-6">
                <div className="flex-shrink-0">
                  <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-200">
                    <link.icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-medium">
                    <span className="rounded-sm">
                      <a href={link.href} className="focus:outline-none">
                        <span className="absolute inset-0" aria-hidden="true" />
                        {link.title}
                      </a>
                    </span>
                  </h3>
                  <p className="text-base text-gray-500">{link.description}</p>
                </div>
                <div className="flex-shrink-0 self-center">
                  <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <a href="#" className="text-base font-semibold underline">
              Or go back home
              <span aria-hidden="true"> &rarr;</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}