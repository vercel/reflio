import cn from 'classnames';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { postData } from '@/utils/helpers';
import { getStripe } from '@/utils/stripe-client';
import { useUser } from '@/utils/useUser';
import Button from '@/components/Button'; 
import PricingFeatures from '@/components/PricingFeatures'; 

export const Pricing = ({ products }) => {
  const router = useRouter();
  const { session, planDetails } = useUser();
  const [priceIdLoading, setPriceIdLoading] = useState(false);

  const handleCheckout = async (price) => {    
    setPriceIdLoading(price);

    if (!session) {
      return router.push('/signin');
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
                  {planDetails === 'free' ? 'Current Plan' : 'Get Started for Free'}
                </Button>
              </div>
              <div className="pt-6 pb-8 px-6">
                <PricingFeatures productName="Indie"/>
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
                      disabled={planDetails === product?.name}
                      medium
                      secondary
                      className="mt-8 w-full"
                      onClick={() => handleCheckout(product?.prices[0].id)}
                    >
                      {planDetails === product?.name ? 'Current Plan' : priceIdLoading === product?.prices[0].id ? 'Loading...' : `Subscribe to ${product?.name}`}
                    </Button>
                  </div>
                  <div className="pt-6 pb-8 px-6">
                    <PricingFeatures productName={product?.name}/>
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