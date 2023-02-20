/* eslint-disable @next/next/no-img-element */
import { useUserAffiliate } from "@/utils/UserAffiliateContext";
import { CopyToClipboard } from "react-copy-to-clipboard";
import toast from "react-hot-toast";
import { priceString, priceStringDivided } from "@/utils/helpers";
import LoadingDots from "./LoadingDots";
import { useMemo } from "react";
import Button from "@/components/Button";

const CampaignsList = (props) => {
  const { userAffiliateDetails } = useUserAffiliate();

  const inviteUrl = useMemo(() => {
    if (!userAffiliateDetails) return "";
    const first = userAffiliateDetails[0];
    const username = first?.vercel_username;
    return `https://vercel.com/ambassadors/${username}`;
  }, [userAffiliateDetails]);

  return (
    <div className="wrapper">
      <div>
        {userAffiliateDetails !== null && userAffiliateDetails?.length > 0 ? (
          <div>
            <div className="flex flex-col">
              <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                  <div className="overflow-hidden rounded-lg border-4 border-gray-300 shadow-md">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-200">
                        <tr className="divide-x-4 divide-gray-300">
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold sm:pl-6"
                          >
                            Campaign
                          </th>
                          {/* <th
                            scope="col"
                            className="px-4 py-3.5 text-center text-sm font-semibold"
                          >
                            Company
                          </th> */}
                          <th
                            scope="col"
                            className="px-4 py-3.5 text-center text-sm font-semibold"
                          >
                            Impressions
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3.5 text-center text-sm font-semibold"
                          >
                            Referrals
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3.5 text-center text-sm font-semibold "
                          >
                            Revenue Earned
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {userAffiliateDetails
                          ?.filter(
                            (campaign) => campaign?.campaign_valid !== false
                          )
                          .map((campaign) => (
                            <tr
                              key={campaign?.campaign_id}
                              className="divide-x-4 divide-gray-200"
                            >
                              <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium sm:pl-6">
                                <div className="flex items-center">
                                  <>
                                    <div>
                                      {campaign?.company_image !== null && (
                                        <img
                                          alt="Logo"
                                          src={
                                            process.env
                                              .NEXT_PUBLIC_SUPABASE_STORAGE_URL +
                                            campaign?.company_image
                                          }
                                          className="mr-4 h-14 w-14 object-contain"
                                        />
                                      )}
                                    </div>
                                    {campaign?.campaign_valid !== false && (
                                      <div>
                                        <p className="mb-2 text-xl font-semibold">
                                          {campaign?.campaign_name}
                                        </p>
                                        <p className="text-md">
                                          {campaign?.commission_type ===
                                          "percentage"
                                            ? `${campaign?.commission_value}% commission on all paid referrals`
                                            : `${priceString(
                                                campaign?.commission_value,
                                                campaign?.company_currency
                                              )} commission on all paid referrals`}
                                        </p>
                                      </div>
                                    )}
                                  </>
                                </div>
                                <div className="mt-3">
                                  <p>
                                    <span>Your referral link:&nbsp;</span>
                                    <CopyToClipboard
                                      text={inviteUrl}
                                      onCopy={() =>
                                        toast.success("URL copied to clipboard")
                                      }
                                    >
                                      <button
                                        className="font-semibold text-secondary underline"
                                        href={inviteUrl}
                                      >
                                        {inviteUrl}
                                      </button>
                                    </CopyToClipboard>
                                  </p>
                                  {/* <Button
                                    primary
                                    small
                                    href={`/dashboard/campaigns/${campaign?.affiliate_id}/code`}
                                    className="mt-4"
                                  >
                                    Edit referral code
                                  </Button> */}
                                </div>
                                <div className="mt-4">
                                  <Button
                                    gray
                                    small
                                    href={`/dashboard/campaigns/${campaign?.affiliate_id}/assets`}
                                  >
                                    View company assets
                                  </Button>
                                </div>
                                {/* <p className="mt-4 break-all rounded-xl border-2 border-gray-200 bg-gray-100 p-3 text-sm text-gray-700">
                                  Tip: You can link to any page, just add{" "}
                                  <span className="font-bold text-secondary-2">
                                    ?via=
                                    {campaign?.referral_code
                                      ? campaign?.referral_code
                                      : campaign?.affiliate_id}
                                  </span>{" "}
                                  to the end of the URL to track your referral.
                                </p> */}
                              </td>
                              {/* <td className="whitespace-nowrap p-4 text-center text-sm font-semibold">
                                {campaign?.company_name}
                              </td> */}
                              <td className="whitespace-nowrap p-4 text-center text-sm font-semibold">
                                {campaign?.impressions}
                              </td>
                              <td className="whitespace-nowrap p-4 text-center text-sm font-semibold">
                                {`${campaign?.campaign_referrals} referrals`}
                              </td>
                              <td className="whitespace-nowrap p-4 text-center text-sm font-semibold">
                                {priceStringDivided(
                                  campaign?.commissions_value ?? 0,
                                  campaign?.company_currency
                                )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : userAffiliateDetails === null ? (
          <div>
            <LoadingDots />
          </div>
        ) : (
          userAffiliateDetails?.length === 0 && (
            <div>
              <p>You haven't joined any campaigns.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default CampaignsList;
