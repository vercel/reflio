import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useUser, getSubmissions } from '@/utils/useUser';
import SEOMeta from '@/templates/SEOMeta'; 
import { postData } from '@/utils/helpers';
import { getStripe } from '@/utils/stripe-client';
import Button from '@/components/Button'; 

export default function BillingPage() {
  const router = useRouter();
  const { user, session, userFinderLoaded, planDetails } = useUser();
  const [priceIdLoading, setPriceIdLoading] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingLtd, setLoadingLtd] = useState(false);
  const [ltdInput, setLtdInput] = useState(null);

  const handleCheckout = async (price) => {    
    setLoading(true);

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

  const redirectToCustomerPortal = async () => {
    setLoading(true);
    const { url, error } = await postData({
      url: '/api/create-portal-link',
      token: session.access_token
    });
    if (error) return alert(error.message);
    window.location.assign(url);
    setLoading(false);
  };

  useEffect(() => {
    if(userFinderLoaded){
      if (!user) router.replace('/signin');
    }
  }, [userFinderLoaded, user]);

  return (
    <>
      <SEOMeta title="Settings"/>
      <div className="pb-10 mb-12 border-b-4">
        <div className="pt-10 wrapper">
          <h1 className="text-2xl sm:text-3xl tracking-tight font-extrabold">Your Plan</h1>
        </div>
      </div>
      <div className="wrapper">
        <div>
          <div className="rounded-xl bg-white max-w-2xl overflow-hidden shadow-lg border-4 border-gray-200">
            <div className="p-6">
              <div className="flex items-center mb-2">
                <h2 className="text-xl leading-6 font-semibold text-gray-900">Current Plan</h2>
                <span className={`${planDetails === 'free' ? 'bg-gray-500' : 'bg-secondary' } text-white py-1 px-3 text-xs rounded-xl ml-2 uppercase font-semibold`}>{planDetails === 'free' ? 'Free' : planDetails}</span>
              </div>
              <p className="text-lg mb-1"><span className="font-semibold">34 of {planDetails === 'free' ? '15' : '∞'}</span> submissions received.</p>
              <p className="text-lg"><span className="font-semibold">3 of {planDetails === 'free' ? '1' : '∞'}</span> projects created.</p>
              {
                planDetails === 'free' &&
                <p className="text-md bg-gray-100 rounded-xl p-4 mt-3">Upgrade to <span className="font-bold">PRO</span> for <span className="font-semibold">$14/month</span> to unlock unlimited submissions, unlimited projects, automatic console errors & more.</p>
              }
            </div>
            <div className="border-t-4 p-6 bg-white flex items-center justify-start">
              {
                planDetails === 'free' ?
                  <Button
                    medium
                    secondary
                    href="/pricing"
                  >
                    Upgrade Plan
                  </Button>
                :
                  <Button
                    medium
                    secondary
                    onClick={e=>{redirectToCustomerPortal()}}
                  >
                    Upgrade Plan
                  </Button>
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
}