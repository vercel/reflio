/* eslint-disable @next/next/no-img-element */

import { useEffect } from 'react';
import { Button } from '@/components/Button';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { Features } from '@/components/Features';
import { Testimonials } from '@/components/Testimonials';
import { Github } from '@/components/Icons/Github'; 
import { useUser } from '@/utils/useUser';
import { useRouter } from 'next/router';

export default function Index() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace('/dashboard');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return(
    <>
      <div id="#intro">
        <div className="relative py-14 md:py-24 bg-gradient-to-b from-white via-gray-50 to-primary">
          <div className="wrapper text-center">
            <div className="max-w-5xl mx-auto">
              <div className="mb-10">
                <div className="mb-7">
                  <h1 className="inline text-4xl lg:text-6xl font-semibold md:text-transparent md:bg-clip-text md:bg-gradient-to-r from-secondary to-secondary-2 tracking-tight">
                    Create an affiliate program for your SaaS <span className="inline md:text-transparent md:bg-clip-text md:bg-gradient-to-r md:from-secondary md:to-primary">in minutes, from $0/month.</span>
                  </h1>
                </div>
                <p className="text-xl sm:text-2xl font-light">
                  Reflio puts <span className="font-medium underline">digital privacy first</span> and is <a href="https://github.com/Reflio-com/reflio" className="font-medium underline">proudly open-source.</a> All referrals are processed through <span className="font-medium underline">European-owned infrastructure</span>, and our company is registered in the UK.
                </p>
              </div>
              <div className="mt-10">
                <div className="space-y-2 sm:flex sm:items-center sm:justify-center sm:space-x-2 sm:space-y-0">
                  <Button
                    mobileFull
                    large
                    primary
                    href="/signup"
                  >
                    <span>Get Started for Free</span>
                  </Button>
                  <Button
                    mobileFull
                    large
                    secondary
                    external
                    href="https://github.com/Reflio-com/reflio"
                  >
                    <Github className="h-5 w-auto mr-2"/>
                    <span>Star on GitHub</span>
                  </Button>
                </div>
              </div>
              <div className="mt-10 text-sm flex flex-col lg:flex-row space-y-3 lg:space-y-0 items-center justify-between max-w-lg mx-auto">
                <div className="flex items-center font-medium">
                  <CheckCircleIcon className="w-5 lg:w-5 h-auto mr-1"/>
                  <p>Free plan available</p>
                </div>
                <div className="flex items-center font-medium">
                  <CheckCircleIcon className="w-5 lg:w-5 h-auto mr-1"/>
                  <p>Auto cookie consent collection</p>
                </div>
                <div className="flex items-center font-medium">
                  <CheckCircleIcon className="w-5 lg:w-5 h-auto mr-1"/>
                  <p>GDPR compliant</p>
                </div>
              </div>
            </div>
            <div className="hidden md:block mt-16 -mb-40">
              <div className="max-w-4xl mx-auto">
                <div className="px-0 w-full h-auto bg-white rounded-3xl shadow-2xl mx-auto overflow-hidden">
                  <img src="platform-screenshot.webp" alt="Screenshot of Reflio dashboard" className="mt-0 w-full h-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="why-reflio">
        <div className="py-14 md:pt-44 md:py-24 bg-gradient-to-b from-gray-200 via-gray-50 to-primary border-t-8 border-gray-300">
          <div className="wrapper">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold">How we&apos;re different to competitors</h2>
            </div>
            <div>
              <Features/>
            </div>
          </div>
        </div>
      </div>
      <div className="py-14 md:pt-24 md:pb-14 bg-gradient-to-b from-primary to-gray-50">
        <div className="wrapper wrapper-sm">
          <div className="text-center">
            <div className="order-1 lg:order-0">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-5 font-semibold">We&apos;re proudly open-source</h2>
              <p className="text-2xl">Reflio is proudly OSS (Open source software). Our source code is available and accessible on GitHub so that anyone can read it, inspect it, review it and even contribute to make Reflio as great as possible.</p>
              <div className="mt-12">
                <Button
                  large
                  secondary
                  external
                  href="https://github.com/Reflio-com/reflio"
                >
                  <Github className="h-5 w-auto mr-2"/>
                  <span>Star on GitHub</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="py-14 md:py-24 bg-gradient-to-b from-gray-50 to-gray-200">
        <div className="wrapper">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-y-8 gap:space-y-0 md:gap-x-16">
            <div className="order-1 lg:order-0">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-5 font-semibold">Your own dedicated affiliate signup page</h2>
              <p className="text-2xl">With Reflio, for each campaign you create you can send potential affiliates your very own signup page and brand it with your logo and colours.</p>
              <div className="mt-12">
                <Button
                  xlarge
                  primary
                  href="/signup"
                >
                  <span>Get Started for Free</span>
                </Button>
              </div>
            </div>
            <div className="order-0 lg:order-1">
              <img loading="lazy" className="w-full max-w-lg h-auto rounded-xl shadow-lg mx-auto" src="/invite-screenshot.webp" alt="Screenshot of join campaign feature"/>
            </div>
          </div>
        </div>
      </div>
      <div className="py-14 md:pb-32 bg-gradient-to-b from-gray-200 to-gray-50">
        <div className="wrapper">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-y-8 gap:space-y-0 md:gap-x-16">
            <div className="order-0 lg:order-1">
              <img loading="lazy" className="w-full max-w-lg h-auto rounded-xl shadow-lg mx-auto" src="/affiliate-screenshot.webp" alt="Screenshot of join campaign feature"/>
            </div>
            <div className="order-1 lg:order-0">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-5 font-semibold">One affiliate dashboard to rule them all</h2>
              <p className="text-2xl">Your affiliates can manage all of their different campaigns from one, easy to use dashboard. Having access to all of their campaigns from different brands in one place means both higher referral conversion and satisfaction rates.</p>
              <div className="mt-12">
                <Button
                  xlarge
                  primary
                  href="/signup"
                >
                  <span>Get Started for Free</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="pricing">
        <div className="py-14 md:py-48 bg-gradient-to-b from-gray-50 via-primary to-gray-200">
          <div className="wrapper wrapper-sm">
            <div className="text-center">
              <div className="order-1 lg:order-0">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-5 font-semibold">Pricing from $0/month</h2>
                <p className="text-2xl">Reflio starts from just $0/month with a 9% fee per successful referral, with different pricing plans available for larger-scale campaigns.</p>
                <div className="mt-12">
                  <Button
                    xlarge
                    secondary
                    href="/pricing"
                  >
                    <span>Learn more</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="py-14 md:pt-24 md:pb-36 bg-gradient-to-b from-gray-200 to-gray-50">
        <div className="wrapper">
          <div>
            <Testimonials/>
          </div>
        </div>
      </div>
    </>
  )
};