import cn from 'classnames';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { postData } from '@/utils/helpers';
import { getStripe } from '@/utils/stripe-client';
import { useUser } from '@/utils/useUser';
import { CheckIcon, XIcon } from '@heroicons/react/solid';
import Button from '@/components/Button'; 

export const Pricing = ({ products }) => {
  const router = useRouter();
  const [priceIdLoading, setPriceIdLoading] = useState();
  const { session, userLoaded, subscription } = useUser();
  const [activePlan, setActivePlan] = useState('free');

  const handleCheckout = async (price) => {
    console.log(price)
    
    setPriceIdLoading(price);

    if (!session) {
      return router.push('/signin');
    }
    if (subscription) {
      return router.push('/dashboard/plan');
    }

    try {
      const { sessionId } = await postData({
        url: '/api/create-checkout-session',
        data: { price },
        token: session.access_token
      });

      const stripe = await getStripe();
      stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      return alert(error.message);
    } finally {
      setPriceIdLoading(false);
    }
  };

  const features = {
    "Indie": [
      {
        text: '200 affiliates',
        type: 'eligible'
      },
      {
        text: '2 companies',
        type: 'eligible'
      },
      {
        text: '4 campaigns',
        type: 'eligible'
      },
      {
        text: 'Stripe auto sync',
        type: 'eligible'
      },
      {
        text: 'PayPal Mass Payouts',
        type: 'eligible'
      },
      {
        text: 'Live chat & email support',
        type: 'eligible'
      },
      {
        text: 'Invite team members',
        type: 'ineligible'
      }
    ],
    "Pro": [
      {
        text: '500 affiliates',
        type: 'eligible'
      },
      {
        text: '5 companies',
        type: 'eligible'
      },
      {
        text: '10 campaigns',
        type: 'eligible'
      },
      {
        text: '3 team members',
        type: 'eligible'
      },
      {
        text: 'Stripe auto sync',
        type: 'eligible'
      },
      {
        text: 'PayPal Mass Payouts',
        type: 'eligible'
      },
      {
        text: 'Live chat & email support',
        type: 'eligible'
      }
    ],
    "Team": [
      {
        text: '2000 affiliates',
        type: 'eligible'
      },
      {
        text: '10 companies',
        type: 'eligible'
      },
      {
        text: 'Unlimited campaigns',
        type: 'eligible'
      },
      {
        text: '20 team members',
        type: 'eligible'
      },
      {
        text: 'Stripe auto sync',
        type: 'eligible'
      },
      {
        text: 'PayPal Mass Payouts',
        type: 'eligible'
      },
      {
        text: 'Priority live chat & email support',
        type: 'eligible'
      }
    ]
  };

  console.log(features);

  if(products?.length){
    return (
      <div>
        <div>
          <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-4">
            <div key="free" className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200 bg-white">
              <div className="p-6">
                <h2 className="text-2xl leading-6 font-semibold text-gray-900">Free</h2>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">9%</span>
                  <span className="text-base font-medium text-gray-500"> fee per referral</span>
                </p>
                <Button
                  medium
                  gray
                  className="mt-8 w-full"
                  href="/signup"
                >
                  Get Started for Free
                </Button>
              </div>
              <div className="pt-6 pb-8 px-6">
                <ul role="list" className="space-y-4">
                  {
                    features["Indie"].map((feature, index) => {
                      return(
                        <li key={index} className={`${feature.type === 'ineligible' && 'opacity-50'} flex space-x-3`}>
                          {
                            feature.type === 'eligible' ?
                              <CheckIcon className="h-6 w-6 text-green-600"/>
                            : <XIcon className="h-6 w-6 text-gray-500"/>
                          }
                          <span className="text-base text-gray-500">{feature.text}</span>
                        </li>
                      )
                    })
                  }
                </ul>
              </div>
            </div>
            {products.map((product) => {
              const priceString = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: product?.prices[0].currency,
                minimumFractionDigits: 0
              }).format(product.prices[0].unit_amount / 100);

              return (
                <div key={product?.name} className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200 bg-white">
                  <div className="p-6">
                    <h2 className="text-2xl leading-6 font-semibold text-gray-900">{product?.name}</h2>
                    <p className="mt-8">
                      <span className="text-4xl font-extrabold text-gray-900">{priceString}</span>
                      <span className="text-base font-medium text-gray-500">/mo - <span className="text-sm text-gray-500">(0% fee)</span></span>
                    </p>
                    <Button
                      medium
                      secondary
                      className="mt-8 w-full"
                      onClick={() => handleCheckout(product?.prices[0].id)}
                    >
                      Subscribe to {product?.name}
                    </Button>
                  </div>
                  <div className="pt-6 pb-8 px-6">
                    <ul role="list" className="space-y-4">
                      {
                        features[product?.name].map((feature, index) => {
                          return(
                            <li key={index} className={`${feature.type === 'ineligible' && 'opacity-50'} flex space-x-3`}>
                              {
                                feature.type === 'eligible' ?
                                  <CheckIcon className="h-6 w-6 text-green-600"/>
                                : <XIcon className="h-6 w-6 text-gray-500"/>
                              }
                              <span className="text-base text-gray-500">{feature.text}</span>
                            </li>
                          )
                        })
                      }
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  } else {
    return false;
  }
};

export default Pricing;