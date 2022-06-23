import cn from 'classnames';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { postData } from '@/utils/helpers';
import { getStripe } from '@/utils/stripe-client';
import { useUser } from '@/utils/useUser';

export default function Pricing({ products }) {
  const router = useRouter();
  const [priceIdLoading, setPriceIdLoading] = useState();
  const { session, userLoaded, subscription } = useUser();
  const [activePlan, setActivePlan] = useState(products[0]);

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
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-x-5 max-w-3xl mx-auto">
          <div className="space-y-5">
            {products.map((product) => {
              const priceString = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: product.prices[0].currency,
                minimumFractionDigits: 0
              }).format(product.prices[0].unit_amount / 100);

              return (
                <div onClick={e=>{setActivePlan(product)}} className={`cursor-pointer bg-gradient-to-b from-secondary to-secondary-2 rounded-xl p-6 shadow-lg border-4 ${activePlan?.name === product?.name ? 'border-secondary-2' : 'border-transparent'}`}>
                  <h3 className="text-xl font-semibold">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-white">{product?.name}</p>
                      <p className="text-white">{priceString}/mo</p>
                    </div>
                    <p className="text-base font-medium text-white">That they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will.</p>
                  </h3>
                </div>
              );
            })}
          </div>
          <div className="bg-gradient-to-b from-secondary to-secondary-2 rounded-xl p-6 shadow-lg flex-grow h-full flex flex-col items-center justify-center">
            {/* <button
              loading={priceIdLoading === activePlan?.id}
              onClick={() => handleCheckout(activePlan?.prices[0])}
              className="pricing-button gradient-bg px-8 py-4 inline-flex mx-auto rounded-lg font-semibold text-white transition-all text-xl md:px-16"
            >
              {activePlan?.name === subscription?.prices?.products.name
                ? 'Manage'
                : 'Get Started'}
            </button> */}
          </div>
        </div>
      </div>
    );
  } else {
    return false;
  }
}