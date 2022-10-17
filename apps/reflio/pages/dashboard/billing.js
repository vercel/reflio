import { useState } from 'react';
import { useUser } from '@/utils/useUser';
import SEOMeta from '@/templates/SEOMeta'; 
import { postData } from '@/utils/helpers';
import Button from '@/components/Button'; 
import Card from '@/components/Card'; 
import PricingFeatures from '@/components/PricingFeatures'; 

export default function BillingPage() {
  const { session, planDetails, subscription } = useUser();
  const [loading, setLoading] = useState(false);
  
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

  return (
    <>
      <SEOMeta title="Settings"/>
      <div className="pb-10 mb-12 border-b-4">
        <div className="pt-10 wrapper">
          <h1 className="text-2xl sm:text-3xl tracking-tight font-extrabold">Your Plan</h1>
        </div>
      </div>
      <div className="wrapper">
        <Card>
          <div className="flex items-center mb-4">
            <h2 className="text-xl leading-6 font-semibold text-gray-900">Current Plan: <span className="capitalize font-medium">{planDetails === 'free' ? 'Pay-as-you-go (9% fee)' : planDetails}</span></h2>
          </div>
          <div className="bg-gray-100 rounded-xl p-6">
            <PricingFeatures normal productName={planDetails === 'free' ? 'Indie' : planDetails}/>
          </div>
          <div className="mt-6 pt-6 border-t-4 bg-white sm:flex sm:items-center sm:justify-start">
            <Button
              medium
              mobileFull
              secondary
              href="/pricing"
            >
              Upgrade Plan
            </Button>
            {
              planDetails !== 'free' &&
              <Button
                className="mt-3 ml-0 sm:ml-3 sm:mt-0"
                mobileFull
                medium
                gray
                onClick={e=>{redirectToCustomerPortal()}}
              >
                {loading ? 'Loading...' : 'Manage Plan'}
              </Button>
            }
          </div>
        </Card>
      </div>
    </>
  );
}