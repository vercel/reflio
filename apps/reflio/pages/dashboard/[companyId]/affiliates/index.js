import { useState } from 'react';
import { useRouter } from 'next/router';
import { useCompany } from '@/utils/CompanyContext';
import { useUser, deleteAffiliate } from '@/utils/useUser';
import { useAffiliate } from '@/utils/AffiliateContext';
import LoadingTile from '@/components/LoadingTile';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import { SEOMeta } from '@/templates/SEOMeta';
import { UserGroupIcon } from '@heroicons/react/solid';
import { TrashIcon, PencilAltIcon } from '@heroicons/react/outline';
import ReactTooltip from 'react-tooltip';
import { priceStringDivided, postData } from 'utils/helpers';
import setupStepCheck from '@/utils/setupStepCheck';
import toast from 'react-hot-toast';

export default function InnerDashboardPage() {
  setupStepCheck('light');

  const router = useRouter();
  const { activeCompany } = useCompany();
  const { session } = useUser();
  const { mergedAffiliateDetails } = useAffiliate();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeAffiliateEdit, setActiveAffiliateEdit] = useState(false);

  const handleDelete = async (affiliateId) => {
    if (
      window.confirm(
        'Are you sure you want to delete this affiliate? This decision is irreversible'
      )
    ) {
      await deleteAffiliate(affiliateId).then((result) => {
        if (result === 'success') {
          router.reload();
        } else {
          toast.error(
            'There was an error when deleting this affiliate. Please try again later.'
          );
        }
      });
    }
  };

  const handleEditAffiliateModal = async (affiliate) => {
    setShowModal(true);
    setActiveAffiliateEdit(affiliate);
  };
  
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
        url: `/api/affiliates/${activeAffiliateEdit?.vercel_username}/edit`,
        data: {
          companyId: router?.query?.companyId,
          campaignId: data?.campaign_id,
          inviteEmail: data?.invite_email,
          name: data?.name,
          vercel_username: data?.vercel_username,
        },
        token: session.access_token
      });

      if (response === 'success') {
        toast.success('Affiliate successfully edited');
        router.replace(`/dashboard/${router?.query?.companyId}/affiliates`);
      } else {
        toast.error('There was an error when editing this affiliate.')
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOMeta title="Affiliates" />
      <div className="mb-8">
        <div className="wrapper flex items-center justify-between pt-10">
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Affiliates
          </h1>
          <Button
            href={`/dashboard/${router?.query?.companyId}/affiliates/invite`}
            medium
            primary
          >
            <span>Add affiliate</span>
          </Button>
        </div>
      </div>
      <div className="wrapper">
        {activeCompany && mergedAffiliateDetails ? (
          mergedAffiliateDetails !== null &&
          mergedAffiliateDetails?.length > 0 ? (
            <div>
              <div className="flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-lg border-4 border-gray-300 shadow-md">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-200">
                          <tr>
                            <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-6"
                            >
                              Email
                            </th>
                            <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-6"
                            >
                              Name
                            </th>
                            <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-6"
                            >
                              Username
                            </th>
                            <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-6"
                            >
                              Affiliate ID
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-left text-sm font-semibold"
                            >
                              Campaign
                            </th>
                            <th
                              data-tip="Impressions are counted and tracked when a cookie was successfully set on the users device."
                              scope="col"
                              className="px-3 py-3.5 text-left text-sm font-semibold"
                            >
                              Impressions
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-left text-sm font-semibold"
                            >
                              Revenue Contributed
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-left text-sm font-semibold"
                            >
                              Signup Method
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-left text-sm font-semibold"
                            >
                              Status
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-left text-sm font-semibold"
                            ></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {mergedAffiliateDetails?.map((affiliate) => (
                            <tr key={affiliate?.affiliate_id}>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                <div className="flex items-center">
                                  <div className="ml-4">
                                    <span>
                                      {affiliate?.details?.email ??
                                        affiliate?.invite_email}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm">
                                <p>{affiliate?.name ?? '-'}</p>
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm">
                                <p>{affiliate?.vercel_username ?? '-'}</p>
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm">
                                <p>{affiliate?.affiliate_id}</p>
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm">
                                {affiliate?.campaign_name ? (
                                  <a
                                    href={`/dashboard/${router?.query?.companyId}/campaigns/${affiliate?.campaign_id}`}
                                    className="font-bold underline"
                                  >
                                    {affiliate?.campaign_name}
                                  </a>
                                ) : (
                                  <p className="font-semibold italic text-gray-600">
                                    This campaign was either deleted or no
                                    longer exists.
                                  </p>
                                )}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm">
                                <p>{affiliate?.impressions}</p>
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm">
                                <p>
                                  {priceStringDivided(
                                    affiliate?.commissions_value ?? 0,
                                    activeCompany?.company_currency
                                  )}
                                </p>
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm">
                                {affiliate?.invite_email === 'manual'
                                  ? 'Public signup'
                                  : 'Manual invite'}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm">
                                <span
                                  className={`${
                                    affiliate?.accepted === true
                                      ? 'bg-secondary text-white'
                                      : 'bg-gray-500 text-white'
                                  } inline-flex rounded-full px-3 py-1 text-xs font-semibold leading-5`}
                                >
                                  {affiliate?.accepted === true
                                    ? 'Active'
                                    : 'Invited'}
                                </span>
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm">
                                <button
                                  className="mr-2"
                                  onClick={(e) => {
                                    handleEditAffiliateModal(affiliate);
                                  }}
                                >
                                  <PencilAltIcon className="h-auto w-5" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    handleDelete(affiliate?.affiliate_id);
                                  }}
                                >
                                  <TrashIcon className="h-auto w-5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <ReactTooltip />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <a
                href={`/dashboard/${router?.query?.companyId}/affiliates/invite`}
                className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <UserGroupIcon className="mx-auto h-auto w-10 text-gray-600" />
                <span className="mt-2 block text-sm font-medium text-gray-600">
                  Invite your first affiliates
                </span>
              </a>
            </div>
          )
        ) : (
          <LoadingTile />
        )}
      </div>
      {
        showModal &&
        <Modal modalOpen={showModal} setModalOpen={setShowModal}>
          <div>
            <div className="pb-4 border-b-4 mb-4">
              <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                Edit affiliate
              </h2>
            </div>
            <form
              action="#"
              method="POST"
              onSubmit={handleSubmit}
            >
              <input type="hidden" value={activeAffiliateEdit?.campaign_id} name="campaign_id" id="campaign_id" />
              <div>
                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-3 block text-xl font-semibold text-gray-900"
                    >
                      Name
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        defaultValue={activeAffiliateEdit?.name}
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
                        defaultValue={activeAffiliateEdit?.vercel_username}
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
                      htmlFor="invite_email"
                      className="mb-3 block text-xl font-semibold text-gray-900"
                    >
                      Email
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        defaultValue={activeAffiliateEdit?.invite_email}
                        placeholder="natalie.ziemba@vercel.com"
                        name="invite_email"
                        id="invite_email"
                        type="text"
                        className="sm:text-md block w-full min-w-0 flex-1 rounded-xl border-2 border-gray-300 p-3 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <Button large primary disabled={loading}>
                  <span>{loading ? 'Editing user...' : 'Edit user'}</span>
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      }
    </>
  );
}
