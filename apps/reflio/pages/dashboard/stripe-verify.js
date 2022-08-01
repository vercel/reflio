import { useState } from 'react';
import { useRouter } from 'next/router';
import { useUser, newStripeAccount } from '@/utils/useUser';
import SetupProgress from '@/components/SetupProgress'; 
import { useCompany } from '@/utils/CompanyContext';
import { SEOMeta } from '@/templates/SEOMeta'; 
import LoadingDots from '@/components/LoadingDots'; 

export default function Onboarding() {
  const router = useRouter();
  const { user } = useUser();
  const { activeCompany } = useCompany();
  const [pageLoaded, setPageLoaded] = useState(false);
  const [runningStripeFunction, setRunningStripeFunction] = useState(false);
  const [error, setError] = useState(null);

  const handleAddStripeAccount = async (stripeId) => {
    setRunningStripeFunction(true);

    try {      
      const tokenConfirm = await fetch('/api/get-stripe-id', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stripeCode: stripeId
        })
      }).then(function(response) {
        return response.json();
    
      }).then(function(data) {
        return data;
      });

      if(tokenConfirm?.stripe_id){
        const addStripeAccount = await newStripeAccount(user?.id, tokenConfirm?.stripe_id, activeCompany?.company_id);

        if(addStripeAccount === "success"){
          router.replace(`/dashboard/${activeCompany?.company_id}/setup/currency`);
        } else {
          if(addStripeAccount === "error"){
            setError("There was an error when connecting your Stripe account. Please try again later.")
          }
        }
      }
      
    } catch (error) {
      console.error(error);
    }
  };

  if(router?.query?.code && runningStripeFunction === false && user?.id && activeCompany?.company_id){
    handleAddStripeAccount(router?.query?.code);
  }

  return(
    <>
      <SEOMeta title="Verifying Stripe Account"/>
      <div className="py-12 border-b-4 border-gray-300">
        <div className="wrapper">
          <SetupProgress/>
        </div>
      </div>
      <div className="pt-12 mb-6">
        <div className="wrapper">
          <h1 className="text-2xl sm:text-3xl tracking-tight font-extrabold">Verifying stripe account...</h1>
        </div>
      </div>
      <div className="wrapper">
        <div className="rounded-xl bg-white max-w-2xl overflow-hidden shadow-lg border-4 border-gray-300 p-6">
          <div>
            <LoadingDots/>
          </div>
          {
            error !== null &&
            <div>
              <div className="bg-red-500 py-4 px-6 rounded-lg mt-6 text-center">
                <p className="text-white">{error}</p>  
              </div>
              <a className="mt-6 underline block" href="/add-account">Try again</a>
            </div>
          }
        </div>
      </div>
    </>
  );
}