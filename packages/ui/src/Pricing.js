import cn from 'classnames';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { postData } from '@/utils/helpers';
import { getStripe } from '@/utils/stripe-client';
import { useUser } from '@/utils/useUser';
import { CheckIcon } from '@heroicons/react/solid'

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

  if(products?.length){
    return (
      <div>
        <div>
          <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-4">
            <div key="free" className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200 bg-white">
              <div className="p-6">
                <h2 className="text-lg leading-6 font-medium text-gray-900">Free</h2>
                <p className="mt-4 text-sm text-gray-500">The free version.</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">9%</span>
                  <span className="text-base font-medium text-gray-500"> fee per referral</span>
                </p>
                <button
                  type="button"
                  className="mt-8 block w-full bg-gray-800 border border-gray-800 rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-gray-900"
                >
                  Get started for free
                </button>
              </div>
              <div className="pt-6 pb-8 px-6">
                <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">What included</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li className="flex space-x-3">
                    <CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" aria-hidden="true" />
                    <span className="text-sm text-gray-500">This is a feature right here</span>
                  </li>
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
                    <h2 className="text-lg leading-6 font-medium text-gray-900">{product?.name}</h2>
                    <p className="mt-4 text-sm text-gray-500">{product?.description}</p>
                    <p className="mt-8">
                      <span className="text-4xl font-extrabold text-gray-900">{priceString}</span>
                      <span className="text-base font-medium text-gray-500">/mo</span>
                    </p>
                    <button
                      type="button"
                      className="mt-8 block w-full bg-gray-800 border border-gray-800 rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-gray-900"
                    >
                      Subscribe to {product?.name}
                    </button>
                  </div>
                  <div className="pt-6 pb-8 px-6">
                    <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">What included</h3>
                    <ul role="list" className="mt-6 space-y-4">
                      <li className="flex space-x-3">
                        <CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" aria-hidden="true" />
                        <span className="text-sm text-gray-500">This is a feature right here</span>
                      </li>
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