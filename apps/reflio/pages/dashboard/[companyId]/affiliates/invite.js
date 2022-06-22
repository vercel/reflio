import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useUser } from '@/utils/useUser';
import Button from '@/components/ui/Button'; 
import { useCompany } from '@/utils/CompanyContext';
import { useCampaign } from '@/utils/CampaignContext';
import SEOMeta from '@/components/SEOMeta'; 
import { postData } from '@/utils/helpers';
import LoadingDots from '@/components/ui/LoadingDots';
import {
  ArrowNarrowLeftIcon
} from '@heroicons/react/outline';

export default function AffiliateInvitePage() {
  const router = useRouter();
  const { user, userFinderLoaded, session } = useUser();
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
          campaignId: data?.campaign_id,
          emailInvites: data?.invite_emails,
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

  useEffect(() => {
    if(userFinderLoaded){
      if (!user) router.replace('/signin');
    }
  }, [userFinderLoaded, user]);

  return (
    <>
      <SEOMeta title="Invite affiliates"/>
      <div className="py-8 border-b-4">
        <div className="wrapper">
          <Button
            href={`/dashboard/${router?.query?.companyId}/affiliates`}
            small
            gray
          >
            <ArrowNarrowLeftIcon className="mr-2 w-6 h-auto"/>
            <span>Back to affilates</span>
          </Button>
        </div>
      </div>
      <div className="pt-12 mb-6">
        <div className="wrapper">
          <h1 className="text-2xl sm:text-3xl tracking-tight font-extrabold">Invite affiliates</h1>
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
                        Select a campaign for the affiliates to join
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
                      <label htmlFor="invite_emails" className="text-xl font-semibold text-gray-900 block">
                        Emails to invite
                      </label>
                      <p className="mb-1">Separate multiple emails with commas.</p>
                      <p className="text-gray-500 italic mb-3 text-sm">You can send to a maximum of <span className="font-semibold">30 emails per invite</span>. To send more than 30 at once, please contact support.</p>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <textarea
                          required
                          placeholder="user1@email.com, user2@email.com"
                          name="invite_emails"
                          id="invite_emails"
                          className="flex-1 block w-full min-w-0 p-3 rounded-xl focus:outline-none sm:text-md border-2 border-gray-300"
                        ></textarea>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email_subject" className="text-xl font-semibold text-gray-900 mb-3 block">
                        Email subject
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          defaultValue={`Join the ${activeCompany?.company_name} affiliate program`}
                          name="email_subject"
                          id="email_subject"
                          type="text"
                          className="flex-1 block w-full min-w-0 p-3 rounded-xl focus:outline-none sm:text-md border-2 border-gray-300"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email_content" className="text-xl font-semibold text-gray-900 block">
                        Email content
                      </label>
                      <p className="mb-2">The invite link will automatically be included in the email.</p>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <textarea
                          defaultValue={`Hey! I'd like to invite you to join our referral program. Follow the link below to create your account and you'll be earning in no time. If you have any questions, please reply to this email. Kind regards, ${activeCompany?.company_name}`}
                          name="email_content"
                          id="email_content"
                          rows="5"
                          className="flex-1 block w-full min-w-0 p-3 rounded-xl focus:outline-none sm:text-md border-2 border-gray-300"
                        ></textarea>
                      </div>
                    </div>
                    {
                      errorMessage &&
                      <div className="bg-red-500 text-center p-4 mt-8 rounded-lg">
                        <p className="text-white text-md font-medium">There was an error when inviting, please try again later.</p>
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
                    <span>{loading ? 'Sending invites...' : 'Send invites'}</span>
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