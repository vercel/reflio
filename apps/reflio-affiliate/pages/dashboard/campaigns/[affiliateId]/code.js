import { useRouter } from 'next/router';
import { useState } from 'react';
import { useUser, changeReferralCode } from '@/utils/useUser';
import SEOMeta from '@/templates/SEOMeta'; 
import Button from '@/components/Button'; 
import { useUserAffiliate } from '@/utils/UserAffiliateContext';
import LoadingDots from '@/components/LoadingDots';
import { postData } from 'utils/helpers';

const AffiliateCodePage = () => {
  const router = useRouter();
  const { user, session } = useUser();
  const { userAffiliateDetails } = useUserAffiliate();
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  let affiliateFiltered = null;

  const handleSubmit = async (e) => {
    if(affiliateFiltered === null) return false;

    e.preventDefault();

    if(loading === true){
      return false;
    }

    const formData = new FormData(e.target);
    const data = {};
 
    for (let entry of formData.entries()) {
      data[entry[0]] = entry[1];
    }

    setLoading(true);

    const { response } = await postData({
      url: '/api/affiliate/change-code',
      data: { 
        affiliateId: affiliateFiltered?.affiliate_id,
        companyId: affiliateFiltered?.company_id,
        userCode: data.referral_code
      },
      token: session.access_token
    });

    if(response === "success"){
      setErrorMessage(null);
      router.replace(`/dashboard/campaigns`);
    } else if(response === "match"){
      setErrorMessage("You already have already used this code for a different campaign with the same company. Please user a unique referral code per campaign for the same company.")
    } else {
      setErrorMessage("There was an error when saving your new referral code. Please try again later.");
    }

    setLoading(false);

  };
  
  if(affiliateFiltered === null && userAffiliateDetails !== null && userAffiliateDetails?.length > 0){
    if(userAffiliateDetails?.filter(campaign=>campaign?.affiliate_id === router.query.affiliateId)?.length){
      affiliateFiltered = userAffiliateDetails?.filter(campaign=>campaign?.affiliate_id === router.query.affiliateId)[0];
    } else {
      router.replace('/dashboard/campaigns')
    }
  }

  return (
    <>
      <SEOMeta title="Code Settings"/>
      <div className="pb-10 mb-12 border-b-4">
        <div className="pt-10 wrapper">
          <h1 className="text-2xl sm:text-3xl tracking-tight font-extrabold">Edit Referral Code</h1>
        </div>
      </div>
      <div className="wrapper">
        {
          affiliateFiltered === null ?
            <LoadingDots/>
          :
            <form action="#" method="POST" onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl mt-5 max-w-3xl border-4 border-gray-200">
              <div className="p-6 sm:p-8">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">Your unique referral code for {affiliateFiltered?.campaign_name}</h3>
                  <div>
                    <div className="mt-1 flex items-center mb-3">
                      <input
                        minLength="3"
                        maxLength="20"
                        required
                        defaultValue={affiliateFiltered?.referral_code ? affiliateFiltered?.referral_code : affiliateFiltered?.affiliate_id}
                        type="text"
                        name="referral_code"
                        id="referral_code"
                        autoComplete="referral_code"
                        className="flex-1 block w-full min-w-0 p-3 rounded-xl focus:outline-none sm:text-md border-2 border-gray-300"
                      />
                    </div>
                    <p className="text-gray-500">This is your unique code that tracks your referral when linking to a campaign&apos;s website. By default, it&apos;s a unique 15-digit ID code.</p>
                  </div>
                </div>
              </div>
              <div className="border-t-4 p-6 bg-white flex items-center justify-start">
                <Button
                  medium
                  primary
                  disabled={loading}
                >
                  <span>{loading ? 'Saving Changes...' : 'Save Changes'}</span>
                </Button>
              </div>
              {
                errorMessage !== null &&
                <div className="p-6 pt-3">
                  <div className="bg-red-600 text-center p-4 rounded-lg">
                    <p className="text-white text-sm font-medium">{errorMessage}</p>
                  </div>
                </div>
              }
            </form>
        }
      </div>
    </>
  );
};

export default AffiliateCodePage;