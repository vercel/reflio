import { useRouter } from 'next/router';
import { useState } from 'react';
import { useUser } from '@/utils/useUser';
import Button from '@/components/Button'; 
import { useCompany } from '@/utils/CompanyContext';
import { useCampaign } from '@/utils/CampaignContext';
import { SEOMeta } from '@/templates/SEOMeta'; 
import { postData } from 'utils/helpers';
import LoadingDots from '@/components/LoadingDots';
import {
  ArrowNarrowLeftIcon
} from '@heroicons/react/outline';
import setupStepCheck from '@/utils/setupStepCheck';

export default function ReferralCreatePage() {
  setupStepCheck('light');
  
  const router = useRouter();
  const { session } = useUser();
  const { activeCompany } = useCompany();
  const { userCampaignDetails } = useCampaign();
  const [errorMessage, setErrorMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {

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

    try {
      const { response } = await postData({
        url: '/api/affiliates/invite',
        data: { 
          companyId: router?.query?.companyId,
          companyName: activeCompany?.company_name,
          companyHandle: activeCompany?.company_handle,
          campaignId: data?.campaign_id,
          emailInvites: data?.invite_emails,
          logoUrl: activeCompany?.company_image !== null && activeCompany?.company_image?.length > 0 ? process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL+activeCompany?.company_image : null,
          emailSubject: data?.email_subject?.length > 0 ? data?.email_subject : null,
          emailContent: data?.email_content?.length > 0 ? data?.email_content : null
        },
        token: session.access_token
      });

      if(response === "success"){
        setLoading(false);
        setErrorMessage(false);
        router.replace(`/dashboard/${router?.query?.companyId}/affiliates`);
      }

      if(response === "limit reached"){
        setLoading(false);
        setErrorMessage(true);
      }

    } catch (error) {
      setLoading(false);
      setErrorMessage(true);
    }

  };

  return (
    <>
      <SEOMeta title="Create manual referral"/>
      <div className="py-8 border-b-4">
        <div className="wrapper">
          <Button
            href={`/dashboard/${router?.query?.companyId}/referrals`}
            small
            gray
          >
            <ArrowNarrowLeftIcon className="mr-2 w-6 h-auto"/>
            <span>Back to referrals</span>
          </Button>
        </div>
      </div>
      <div className="pt-12 mb-6">
        <div className="wrapper">
          <h1 className="text-2xl sm:text-3xl tracking-tight font-extrabold">Create a manual referral</h1>
        </div>
      </div>
      <div className="wrapper">
        {
          activeCompany ?
            <div>
              <form className="rounded-xl bg-white max-w-2xl overflow-hidden shadow-lg border-4 border-gray-300" action="#" method="POST" onSubmit={handleSubmit}>
                <div className="p-6">
                  <div className="space-y-5">
                    <div>
                      <label htmlFor="campaign_id" className="text-xl font-semibold text-gray-900 mb-3 block">
                        Select a campaign
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <select className="w-full rounded-xl border-2 border-gray-300 outline-none p-4" required="required" name="campaign_id" id="campaign_id">
                          {
                            userCampaignDetails?.map(campaign => {
                              return(
                                <option value={campaign?.campaign_id}>{campaign?.campaign_name}</option>
                              )
                            })
                          }
                        </select>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="invite_emails" className="text-xl font-semibold text-gray-900 block mb-1">
                        Affiliate ID
                      </label>
                      <p className="mb-3">You can find an affiliate's ID on the <a className="font-bold underline" href={`/dashboard/${router?.query?.companyId}/affiliates`}>Affiliates</a> page</p>
                      <div className="mt-1 flex rounded-md shadow-sm">
                       <input
                          placeholder="Affiliate ID (e.g. 6ryqri3cdjxeyqwl14yi)"
                          name="email_subject"
                          id="email_subject"
                          type="text"
                          required
                          className="flex-1 block w-full min-w-0 p-3 rounded-xl focus:outline-none sm:text-md border-2 border-gray-300"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email_subject" className="text-xl font-semibold text-gray-900 mb-1 block">
                        User's Email Address
                      </label>
                      <p className="mb-3">The email address which the user used to sign up to your product with.</p>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          placeholder="youruser@email.com"
                          name="email_subject"
                          id="email_subject"
                          type="text"
                          className="flex-1 block w-full min-w-0 p-3 rounded-xl focus:outline-none sm:text-md border-2 border-gray-300"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email_subject" className="text-xl font-semibold text-gray-900 mb-1 block">
                        Stripe Payment ID *optional*
                      </label>
                      <p className="mb-3">The ID of the Stripe payment intent or invoice. If the payment is found, this will automatically create a commission for the affiliate.</p>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          placeholder="Stripe Payment ID (e.g. pi_2FaPXJC7NSaZYFlG02P1MRVx)"
                          name="email_subject"
                          id="email_subject"
                          type="text"
                          className="flex-1 block w-full min-w-0 p-3 rounded-xl focus:outline-none sm:text-md border-2 border-gray-300"
                        />
                      </div>
                    </div>
                    {
                      errorMessage &&
                      <div className="bg-red-500 text-center p-4 mt-8 rounded-lg">
                        <p className="text-white text-md font-medium">There was an error when creating the referral, please try again later.</p>
                      </div>
                    }
                  </div>
                </div>
                <div className="border-t-4 p-6 bg-white flex items-center justify-start">
                  <Button
                    large
                    primary
                    disabled={loading}
                  >
                    <span>{loading ? 'Sending invites...' : 'Create referral'}</span>
                  </Button>
                </div>
              </form>
            </div>
          :
            <div>
              <LoadingDots/>
            </div>
        }
      </div>
    </>
  );
}