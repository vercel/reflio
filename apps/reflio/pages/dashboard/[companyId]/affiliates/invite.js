import { useRouter } from 'next/router';
import { useState } from 'react';
import { useUser } from '@/utils/useUser';
import Button from '@/components/Button';
import { useCompany } from '@/utils/CompanyContext';
import { useCampaign } from '@/utils/CampaignContext';
import { SEOMeta } from '@/templates/SEOMeta';
import { postData } from 'utils/helpers';
import LoadingDots from '@/components/LoadingDots';
import { ArrowNarrowLeftIcon } from '@heroicons/react/outline';
import setupStepCheck from '@/utils/setupStepCheck';

export default function AffiliateInvitePage() {
  setupStepCheck('light');

  const router = useRouter();
  const { session } = useUser();
  const { activeCompany } = useCompany();
  const { userCampaignDetails } = useCampaign();
  const [errorMessage, setErrorMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading === true) {
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
          name: data?.name,
          vercel_username: data?.vercel_username,
          logoUrl:
            activeCompany?.company_image !== null &&
            activeCompany?.company_image?.length > 0
              ? process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL +
                activeCompany?.company_image
              : null,
          emailSubject:
            data?.email_subject?.length > 0 ? data?.email_subject : null,
          emailContent:
            data?.email_content?.length > 0 ? data?.email_content : null
        },
        token: session.access_token
      });

      if (response === 'success') {
        setLoading(false);
        setErrorMessage(false);
        router.replace(`/dashboard/${router?.query?.companyId}/affiliates`);
      }

      if (response === 'limit reached') {
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
      <SEOMeta title="Invite affiliates" />
      <div className="border-b-4 py-8">
        <div className="wrapper">
          <Button
            href={`/dashboard/${router?.query?.companyId}/affiliates`}
            small
            gray
          >
            <ArrowNarrowLeftIcon className="mr-2 h-auto w-6" />
            <span>Back to affilates</span>
          </Button>
        </div>
      </div>
      <div className="mb-6 pt-12">
        <div className="wrapper">
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Invite affiliate
          </h1>
        </div>
      </div>
      <div className="wrapper">
        {activeCompany ? (
          <div>
            <form
              className="max-w-2xl overflow-hidden rounded-xl border-4 border-gray-300 bg-white shadow-lg"
              action="#"
              method="POST"
              onSubmit={handleSubmit}
            >
              <div className="p-6">
                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor="campaign_id"
                      className="mb-3 block text-xl font-semibold text-gray-900"
                    >
                      Select a campaign for the affiliate to join
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <select
                        className="w-full rounded-xl border-2 border-gray-300 p-4 outline-none"
                        required="required"
                        name="campaign_id"
                        id="campaign_id"
                      >
                        {userCampaignDetails?.map((campaign) => {
                          return (
                            <option value={campaign?.campaign_id}>
                              {campaign?.campaign_name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-3 block text-xl font-semibold text-gray-900"
                    >
                      Name
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        placeholder="Natalie Ziemba"
                        name="name"
                        id="name"
                        type="text"
                        className="sm:text-md block w-full min-w-0 flex-1 rounded-xl border-2 border-gray-300 p-3 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="vercel_username"
                      className="mb-3 block text-xl font-semibold text-gray-900"
                    >
                      Vercel Username
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        placeholder="natalie.ziemba"
                        name="vercel_username"
                        id="vercel_username"
                        type="text"
                        className="sm:text-md block w-full min-w-0 flex-1 rounded-xl border-2 border-gray-300 p-3 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="invite_emails"
                      className="block text-xl font-semibold text-gray-900"
                    >
                      Email
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <textarea
                        required
                        placeholder="natalie.ziemba@vercel.com"
                        name="invite_emails"
                        id="invite_emails"
                        className="sm:text-md block w-full min-w-0 flex-1 rounded-xl border-2 border-gray-300 p-3 focus:outline-none"
                      ></textarea>
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="email_subject"
                      className="mb-3 block text-xl font-semibold text-gray-900"
                    >
                      Email subject
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        defaultValue={`Join ${activeCompany?.company_name}'s affiliate program.`}
                        name="email_subject"
                        id="email_subject"
                        type="text"
                        className="sm:text-md block w-full min-w-0 flex-1 rounded-xl border-2 border-gray-300 p-3 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="email_content"
                      className="block text-xl font-semibold text-gray-900"
                    >
                      Email content
                    </label>
                    <p className="mb-2">
                      The invite link will automatically be included in the
                      email.
                    </p>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <textarea
                        defaultValue={`Hey! I'd like to invite you to join our referral program. 

Follow the link below to create your account and you'll be earning in no time. If you have any questions, please reply to this email. 

Kind regards, 
${activeCompany?.company_name}`}
                        name="email_content"
                        id="email_content"
                        rows="8"
                        className="sm:text-md block w-full min-w-0 flex-1 rounded-xl border-2 border-gray-300 p-3 focus:outline-none"
                      ></textarea>
                    </div>
                  </div>
                  {errorMessage && (
                    <div className="mt-8 rounded-lg bg-red-500 p-4 text-center">
                      <p className="text-md font-medium text-white">
                        There was an error when inviting, please try again
                        later.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-start border-t-4 bg-white p-6">
                <Button large primary disabled={loading}>
                  <span>{loading ? 'Sending invite...' : 'Send invite'}</span>
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            <LoadingDots />
          </div>
        )}
      </div>
    </>
  );
}
