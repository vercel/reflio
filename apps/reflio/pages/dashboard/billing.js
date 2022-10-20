import { useState, useEffect } from 'react';
import { useUser, getReflioCommissionsDue } from '@/utils/useUser';
import { useCompany } from '@/utils/CompanyContext';
import SEOMeta from '@/templates/SEOMeta'; 
import { postData, prettyMonthStartAndEnd, priceStringDivided, checkUTCDateExpired, UTCtoString } from '@/utils/helpers';
import Button from '@/components/Button'; 
import Card from '@/components/Card'; 
import { PricingParams, PricingFeatures } from '@/components/PricingFeatures'; 
import LoadingDots from '@/components/LoadingDots';

export default function BillingPage() {
  const { session, planDetails, user, team, subscription } = useUser();
  const { activeCompany } = useCompany();
  const [loading, setLoading] = useState(false);
  const [usageData, setUsageData] = useState(null);
  const [loadingUsageData, setLoadingUsageData] = useState(false);
  const [commissions, setCommissions] = useState([]);

  const getUsageData = async () => {    
    try {
      const { response } = await postData({
        url: '/api/team/usage',
        data: { 
          teamId: team?.team_id,
        },
        token: session.access_token
      });

      if(response !== "error"){
        setUsageData(response);
      }
      
    } catch (error) {
      console.log(error)
    }
  };

  const redirectToCustomerPortal = async () => {
    setLoading(true);
    const { url, error } = await postData({
      url: '/api/create-portal-link',
      token: session.access_token
    });
    if (error) return alert(error.message);
    window.location.assign(url);
    setLoading(false);
  };
  
  if(commissions?.length === 0 && planDetails === "free"){
    getReflioCommissionsDue(team?.team_id).then(results => {
      if(results !== "error" && results?.data?.length){
        setCommissions(results);
      }

      if(results === "error"){
        console.warn("There was an error when getting data");
      }

      if(results?.data?.length === 0){
        setCommissions({"data": []});
      }
    })
  }
  
  const ProgressBar = ({ type, unlimited }) => {
    if(usageData === null) return false;

    const plans = PricingParams();
    const usagePercentage = ((usageData[type] / plans[planDetails][type]) * 100).toFixed(0);
    
    return(
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="capitalize">{type}</h3>
          <span>
            {usageData[type]} <span className="text-gray-500">/ {unlimited === true ? '∞' : plans[planDetails][type]}</span>
          </span>
        </div>
        <div className="h-6 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-primary-2"
            style={{ width: `${unlimited === true ? '1%' : usagePercentage > 100 ? '100%' : usagePercentage+'%'}` }}
          ></div>
        </div>
      </div>
    )
  }
  
  useEffect(() => {
    if (user && team?.team_id && usageData === null && loadingUsageData === false) {
      setLoadingUsageData(true);
      getUsageData();
    }
  });

  console.log("commissions:")
  console.log(commissions)

  return (
    <>
      <SEOMeta title="Billing"/>
      <div className="pb-10 mb-12 border-b-4">
        <div className="pt-10 wrapper">
          <h1 className="text-2xl sm:text-3xl tracking-tight font-extrabold">Billing / Plans</h1>
        </div>
      </div>
      <div className="wrapper">
        {/* WIP!!! */}
        {/* {
          planDetails === 'free' &&
            <div className="mb-6">
              <Card className="w-full max-w-full">
                <div className="flex items-center mb-4">
                  <h2 className="text-xl leading-6 font-semibold text-gray-900">Commission payments owed to Reflio</h2>
                </div>
                <div>
                  {
                    commissions !== null && commissions?.data?.length ?
                      <div>
                        <table className="min-w-full divide-y divide-gray-300">
                          <thead className="bg-gray-200">
                            <tr>      
                              <th data-tip="The total amount received, after any deductions for refunds and discounts." scope="col" className="px-3 py-3.5 text-sm text-left font-semibold">
                                Sale Amount
                              </th>      
                              <th data-tip="This is a 9% commission due to Reflio, since you are on the Pay-as-you-go plan. Upgrade your plan today to remove commission fees." scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                                Reflio Fee (9%)
                              </th>             
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                                Products
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                                Referral ID
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                                Date Created
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white text-sm">
                            {commissions?.data?.map((sale) => (
                              <tr key={sale?.commission_id}>  
                                <td className="whitespace-nowrap px-3 py-4 text-sm sm:pl-6">
                                  <span>{priceStringDivided(sale?.commission_sale_value, activeCompany?.company_currency)}</span>
                                </td>
                                <td className={`whitespace-nowrap px-3 py-4 font-semibold ${checkUTCDateExpired(sale?.commission_due_date) === true && 'text-red-500'}`}>
                                  <span>{priceStringDivided(((9/100)*sale?.commission_sale_value).toFixed(2), activeCompany?.company_currency)}</span>
                                </td>   
                                <td className="px-3 py-4 text-sm max-w-xs break-all">
                                  {sale?.commission_description ?? 'N/A'}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm">
                                  {sale?.referral_id}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm">
                                  <div data-tip={sale?.created}>{UTCtoString(sale?.created)}</div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="mt-6">
                          <Button
                            small
                            mobileFull
                            red
                            href="/pricing"
                          >
                            Pay due fees
                          </Button>
                        </div>
                      </div>
                    : 
                      commissions?.data?.length === 0 ?
                        <p>You currently have no due commissions.</p>
                    :
                      <div className="my-6">
                        <LoadingDots/>
                      </div>
                      
                  }
                </div>
              </Card>
            </div>
        } */}
        <div className="grid grid-cols-1 space-y-6 md:space-y-0 md:grid-cols-2 md:space-x-6">
          <Card>
            <div className="flex items-center mb-4">
              <h2 className="text-xl leading-6 font-semibold text-gray-900">Current Plan: <span className="capitalize font-medium">{planDetails === 'free' ? 'Pay-as-you-go (9% fee)' : planDetails}</span></h2>
            </div>
            <div className="bg-gray-100 rounded-xl p-6">
              <PricingFeatures normal productName={planDetails}/>
            </div>
            <div className="mt-6 pt-6 border-t-4 bg-white sm:flex sm:items-center sm:justify-start">
              <Button
                medium
                mobileFull
                secondary
                href="/pricing"
              >
                Upgrade Plan
              </Button>
              {
                planDetails !== 'free' &&
                <Button
                  className="mt-3 ml-0 sm:ml-3 sm:mt-0"
                  mobileFull
                  medium
                  gray
                  onClick={e=>{redirectToCustomerPortal()}}
                >
                  {loading ? 'Loading...' : 'Manage Plan'}
                </Button>
              }
            </div>
          </Card>
          <Card>
            <div>
              <h2 className="text-xl leading-6 font-semibold text-gray-900 mb-5">Usage Metrics</h2>
              {
                usageData !== null ?
                  <div className="space-y-5">
                    <ProgressBar type="companies"/>
                    <ProgressBar type="campaigns"/>
                    <ProgressBar type="affiliates"/>
                    <ProgressBar type="referrals" unlimited={true}/>
                    <ProgressBar type="commissions" unlimited={true}/>
                  </div>
                :
                  <div className="flex items-center justify-center mt-24">
                    <LoadingDots/>
                  </div>
              }
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}