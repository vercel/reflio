import { useState } from 'react';
import { useRouter } from 'next/router';
import { useUser, newStripeAccount } from '@/utils/useUser';
import SetupProgress from '@/components/ui/SetupProgress'; 
import { useCompany } from '@/utils/CompanyContext';
import SEOMeta from '@/components/SEOMeta'; 

export default function Onboarding() {
  const router = useRouter();
  const { user } = useUser();
  const { activeCompany } = useCompany();
  const [pageLoaded, setPageLoaded] = useState(false);
  const [runningStripeFunction, setRunningStripeFunction] = useState(false);
  const [error, setError] = useState(null);

  const handleAddStripeAccount = async (stripeId) => {
    setRunningStripeFunction(true);

    console.log("function running here!!!!")
    console.log(stripeId);

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
      <div className="py-16">
        <SetupProgress/>
        <div className="wrapper">
          <div className="max-w-xl mx-auto bg-white rounded-xl p-8 shadow-lg">
            <h1 className="text-2xl tracking-tight font-extrabold">
              {
                error !== null ? 'Error' : 'Verifying stripe account...'
              }
            </h1>
            {
              error !== null &&
              <div>
                <div className="bg-red py-4 px-6 rounded-lg mt-6 text-center">
                  <p className="text-white">{error}</p>  
                </div>
                <a className="mt-6 underline block" href="/add-account">Try again</a>
              </div>
            }
          </div>
        </div>
      </div>
    </>
  );
}