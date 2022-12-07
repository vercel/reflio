import { useState, useEffect } from 'react';
import { useUser } from '@/utils/useUser';
import { postData } from '@/utils/helpers';
import LoadingTile from '@/components/LoadingTile';
import SEOMeta from '@/templates/SEOMeta';
import { EmojiSadIcon } from '@heroicons/react/solid';
import { UTCtoString, checkUTCDateExpired, priceString } from '@/utils/helpers';
import ReactTooltip from 'react-tooltip';

const ReferralsPage = () => {
  const { user, userFinderLoaded, session } = useUser();
  const [referrals, setReferrals] = useState(null);
  const [loadingReferrals, setLoadingReferrals] = useState(false);

  const affiliateReferrals = async () => {
    try {
      const { referralsData } = await postData({
        url: '/api/affiliate/referrals',
        token: session.access_token
      });

      setReferrals(referralsData);
    } catch (error) {
      console.log(error);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (
      userFinderLoaded &&
      user &&
      referrals === null &&
      loadingReferrals === false
    ) {
      setLoadingReferrals(true);
      affiliateReferrals();
    }
  });

  return (
    <>
      <SEOMeta title="Referrals" />
      <div className="mb-8">
        <div className="wrapper pt-10">
          <h1 className="mb-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
            Referrals {referrals?.count > 0 && `(${referrals?.count})`}
          </h1>
          <p>
            When a user visits your ambassadors page they will appear here as a{' '}
            <strong>&quot;Link Visit&quot;</strong>. If they sign up they will
            appear as <strong>&quot;Signed Up&quot;</strong>. If they start a
            pro trial, once their trial ends and they become a paying customer
            they will appear as <strong>&quot;Converted&quot;</strong>. At this
            time you will also see the referral in the{' '}
            <strong>&quot;Commissions&quot;</strong> page.
          </p>
        </div>
      </div>
      <div className="wrapper">
        {referrals !== null && referrals?.length > 0 ? (
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
                            Referral ID
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold"
                          >
                            Date Created
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold"
                          >
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white text-sm ">
                        {referrals?.map((referral) => (
                          <tr key={referral?.referral_id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                              <span>{referral?.referral_id}</span>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                              <div data-tip={referral?.created}>
                                {UTCtoString(referral?.created)}
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                              {referral?.referral_converted === true ? (
                                <div
                                  className={`bg-secondary-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold leading-5 text-white`}
                                >
                                  Converted
                                </div>
                              ) : referral?.referral_reference_email !==
                                null ? (
                                <div
                                  className={`inline-flex rounded-full bg-orange-400 px-3 py-1 text-xs font-semibold leading-5 text-orange-900`}
                                >
                                  Signed up
                                </div>
                              ) : (
                                <div
                                  data-tip={`${
                                    checkUTCDateExpired(
                                      referral?.referral_expiry
                                    ) === true
                                      ? 'Expired'
                                      : 'Expires'
                                  } at ${referral?.referral_expiry}`}
                                  className={`${
                                    checkUTCDateExpired(
                                      referral?.referral_expiry
                                    ) === true
                                      ? 'bg-red-500 text-white'
                                      : 'bg-gray-400 text-gray-900'
                                  } 'bg-gray-400 text-gray-900'} inline-flex rounded-full px-3 py-1 text-xs font-semibold leading-5`}
                                >
                                  {checkUTCDateExpired(
                                    referral?.referral_expiry
                                  ) === true
                                    ? 'Expired'
                                    : 'Visited link'}
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <ReactTooltip />
                  </div>
                  <div className="mt-2">
                    <span className="text-xs">{`Showing ${referrals?.length} of ${referrals?.length} total referrals.`}</span>
                  </div>
                  {/* {
                        referrals?.count > referrals?.data?.length &&
                        <div className="mt-8 flex justify-center">
                          <Button
                            disabled={loading}
                            onClick={e=>{paginatedResults()}}
                            small
                            gray
                          >
                            <span>{loading ? 'Loading...' : 'Load more'}</span>
                          </Button>
                        </div>
                      } */}
                </div>
              </div>
            </div>
          </div>
        ) : referrals?.length === 0 ? (
          <div>
            <div className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              <EmojiSadIcon className="mx-auto h-auto w-10 text-gray-600" />
              <span className="mt-2 block text-sm font-medium text-gray-600">
                You have no referrals yet.
              </span>
            </div>
          </div>
        ) : (
          <LoadingTile />
        )}
      </div>
    </>
  );
};

export default ReferralsPage;
