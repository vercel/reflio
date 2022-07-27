import { useRouter } from 'next/router';
import { useState } from 'react';
import { useUser, paypalEmail } from '@/utils/useUser';
import SEOMeta from '@/templates/SEOMeta'; 
import { checkValidEmail } from '@/utils/helpers';
import Button from '@/components/Button'; 

const SettingsPage = () => {
  const router = useRouter();
  const { user, userDetails } = useUser();
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emailInput, setEmailInput] = useState(null);
  const [emailValid, setEmailValid] = useState(null);

  const handlePaypalEmail = async (email) => {    
    console.log(email);
    await paypalEmail(user?.id, email).then((result) => {
      if(result === "success"){
        setErrorMessage(null);
        router.replace(window.location.href);
      } else {
        setErrorMessage("Unable to change your PayPal email. Please contact support, or try again later.");
      }
    });
  };
  
  return (
    <>
      <SEOMeta title="Settings"/>
      <div className="pb-10 mb-12 border-b-4">
        <div className="pt-10 wrapper">
          <h1 className="text-2xl sm:text-3xl tracking-tight font-extrabold">Settings</h1>
        </div>
      </div>
      <div className="wrapper">
        <div className="bg-white shadow-lg rounded-xl mt-5 max-w-3xl border-4 border-gray-200">
          <div className="p-6 sm:p-8">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">PayPal Payout Email</h3>
              <div>
                <div className="mt-1 flex items-center mb-3">
                  <input
                    minLength="3"
                    maxLength="50"
                    required
                    defaultValue={userDetails?.paypal_email && userDetails?.paypal_email}
                    placeholder="youremail@email.com"
                    type="email"
                    name="paypal_email"
                    id="paypal_email"
                    autoComplete="paypal_email"
                    onInput={e=>{setEmailInput(e.target.value)}}
                    className="flex-1 block w-full min-w-0 p-3 rounded-xl focus:outline-none sm:text-md border-2 border-gray-300"
                    onChange={e=>{setEmailValid(checkValidEmail(e.target.value)), emailValid ? setEmailInput(e.target.value) : setEmailInput(null)}}
                  />
                </div>
                <p className="text-gray-500">This is the email that your affiliate payout payments will be sent to. Please make sure that it&apos;s the correct email.</p>
              </div>
            </div>
          </div>
          {
            emailInput !== null && emailValid && emailInput?.length > 4 && emailInput?.includes('@') &&
            <div className="border-t-4 p-6 bg-white flex items-center justify-start">
              <Button
                medium
                primary
                disabled={loading}
                onClick={e=>{handlePaypalEmail(emailInput)}}
              >
                <span>{loading ? 'Saving Changes...' : 'Save Changes'}</span>
              </Button>
            </div>
          }
          {
            !emailValid && emailValid !== null && emailInput?.length > 4 &&
            <div className="border-t-4 p-6 bg-white flex items-center justify-start">
              <div className="bg-red-600 text-center p-4 rounded-lg">
                <p className="text-white text-sm font-medium">The email you entered is not valid. Please check it and try again.</p>
              </div>
            </div>
          }
        </div>
        {
          errorMessage !== null &&
          <div className="bg-red-600 text-center p-4 mt-5 rounded-lg">
            <p className="text-white text-sm font-medium">{errorMessage}</p>
          </div>
        }
      </div>
    </>
  );
};

export default SettingsPage;