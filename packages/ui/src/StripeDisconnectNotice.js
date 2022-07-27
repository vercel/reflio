import { useCompany } from '@/utils/CompanyContext';

export const StripeDisconnectNotice = (props) => {
  const { activeCompany } = useCompany();

  if(activeCompany && activeCompany !== null && activeCompany?.company_id && activeCompany?.stripe_id === null && activeCompany?.stripe_account_data !== null){
    return(
      <div className="bg-red-500 text-center text-white py-4 font-semibold">
        <div className="wrapper">
          <p>Your Stripe account is no longer connected and is not sending data. <a href={`/dashboard/${activeCompany?.company_id}/setup/stripe`} className="font-bold underline">Please reconnect your account</a> so that no data is missed, and referral data is tracked.</p>
        </div>
      </div>
    )
  } else {
    return false;
  }
};

export default StripeDisconnectNotice;