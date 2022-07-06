import { useState } from 'react';
import { editCampaign, newCampaign, useUser } from '@/utils/useUser';
import { useCompany } from '@/utils/CompanyContext';
import Button from '@/components/ui/Button';
import LoadingDots from '@/components/ui/LoadingDots';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

const CampaignForm = ({ edit, setupMode }) => {

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [rewardType, setRewardType] = useState('percentage');
  const [discountType, setDiscountType] = useState('percentage');
  const { activeCompany } = useCompany();
  const { userDetails } = useUser();
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

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

    if(edit){

      await editCampaign(edit?.campaign_id, data).then((result) => {
        if(result === "success"){
          router.replace(`/dashboard/${router?.query?.companyId}/campaigns/${edit?.campaign_id}`)
        } else {
          toast.error('There was an error when creating your campaign, please try again later.');
        }
  
        setLoading(false);
      });

    } else {

      await newCampaign(userDetails, data, router?.query?.companyId).then((result) => {
        if(result === "success"){
          if(setupMode){
            router.replace(`/dashboard/${router?.query?.companyId}/setup/add`)
          } else {
            router.replace(`/dashboard/${router?.query?.companyId}/campaigns`)
          }
        } else {
          toast.error('There was an error when creating your campaign, please try again later.');
        }
  
        setLoading(false);
      });

    }
  };

  if(edit && edit?.commission_type !== null && edit?.commission_type !== rewardType){
    setRewardType(edit?.commission_type);
  }

  if(edit && edit?.discount_type !== null && edit?.discount_type !== discountType){
    setDiscountType(edit?.discount_type);
  }

  return(
    <div>
      {
        activeCompany?.company_name ?
          <form className="rounded-xl bg-white max-w-2xl overflow-hidden shadow-lg border-4 border-gray-300" action="#" method="POST" onSubmit={handleSubmit}>
            <div className="px-6 pt-8 pb-12">
              <div className="space-y-8 divide-y divide-gray-200">
                <div>
                  <div>
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-12">
                        <label htmlFor="campaign_name" className="block text-sm font-medium text-gray-700">
                          Campaign Name
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <input
                            minLength="2"
                            required
                            defaultValue={edit ? edit?.campaign_name : `${activeCompany?.company_name}'s Referral Campaign`}
                            type="text"
                            name="campaign_name"
                            id="campaign_name"
                            autoComplete="campaign_name"
                            className="flex-1 block w-full min-w-0 p-3 rounded-xl focus:outline-none sm:text-md border-2 border-gray-300"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-12">
                        <label htmlFor="commission_type" className="block text-sm font-medium text-gray-700">
                          Reward type
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <select defaultValue={rewardType ? rewardType : edit && edit?.commission_type} onChange={e=>{setRewardType(e.target.value)}} className="rounded-xl border-2 border-gray-300 outline-none p-4 w-full" required="required" name="commission_type" id="commission_type">
                            <option value="percentage">Percentage of sale</option>
                            <option value="fixed">Fixed amount</option>
                          </select>
                        </div>
                      </div>

                      {
                        rewardType === 'percentage' &&
                        <div className="sm:col-span-12">
                          <label htmlFor="commission_value" className="block text-sm font-medium text-gray-700">
                            Commission percentage
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm items-center justify-between">
                            <input
                              minLength="1"
                              maxLength="100"
                              required
                              placeholder="20"
                              type="number"
                              name="commission_value"
                              id="commission_value"
                              defaultValue={edit && edit?.commission_value}
                              autoComplete="commission_value"
                              className="flex-1 block w-full min-w-0 p-3 rounded-xl focus:outline-none sm:text-md border-2 border-r-0 rounded-tr-none rounded-br-none border-gray-300"
                            />
                            <span className="min-w-0 p-3 rounded-xl focus:outline-none sm:text-md border-2 rounded-tl-none bg-gray-200 rounded-bl-none border-gray-300">%</span>
                          </div>
                        </div>
                      }

                      {
                        rewardType === 'fixed' &&
                        <div className="sm:col-span-12">
                          <label htmlFor="commission_value" className="block text-sm font-medium text-gray-700">
                            Amount
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm items-center justify-between">
                            <span className="min-w-0 p-3 rounded-xl focus:outline-none sm:text-md border-2 border-r-0 rounded-tr-none bg-gray-200 rounded-br-none border-gray-300">{activeCompany?.company_currency}</span>
                            <input
                              minLength="1"
                              maxLength="100"
                              required
                              placeholder="1"
                              type="number"
                              name="commission_value"
                              id="commission_value"
                              defaultValue={edit && edit?.commission_value}
                              autoComplete="commission_value"
                              className="flex-1 block w-full min-w-0 p-3 rounded-xl focus:outline-none sm:text-md border-2 bor border-r-0 rounded-tl-none rounded-bl-none border-gray-300"
                            />
                          </div>
                        </div>
                      }

                      {
                        showAdvancedOptions &&
                          <>
                            <div className="sm:col-span-12">
                              <label htmlFor="cookie_window" className="block text-sm font-medium text-gray-700">
                                Cookie window
                              </label>
                              <div className="mt-1 flex rounded-md shadow-sm items-center justify-between">
                                <input
                                  minLength="1"
                                  maxLength="100"
                                  required
                                  type="number"
                                  name="cookie_window"
                                  id="cookie_window"
                                  defaultValue={edit?.cookie_window ? edit?.cookie_window : 60}
                                  className="flex-1 block w-full min-w-0 p-3 rounded-xl focus:outline-none sm:text-md border-2 border-r-0 rounded-tr-none rounded-br-none border-gray-300"
                                />
                                <span className="min-w-0 p-3 rounded-xl focus:outline-none sm:text-md border-2 rounded-tl-none bg-gray-200 rounded-bl-none border-gray-300">days</span>
                              </div>
                            </div>
                            <div className="sm:col-span-12">
                              <label htmlFor="commission_period" className="block text-sm font-medium text-gray-700">
                                Commission period
                              </label>
                              <div className="mt-1 flex rounded-md shadow-sm items-center justify-between">
                                <input
                                  minLength="1"
                                  maxLength="240"
                                  required
                                  placeholder="12"
                                  type="number"
                                  name="commission_period"
                                  id="commission_period"
                                  defaultValue={edit && edit?.commission_period}
                                  className="flex-1 block w-full min-w-0 p-3 rounded-xl focus:outline-none sm:text-md border-2 border-r-0 rounded-tr-none rounded-br-none border-gray-300"
                                />
                                <span className="min-w-0 p-3 rounded-xl focus:outline-none sm:text-md border-2 rounded-tl-none bg-gray-200 rounded-bl-none border-gray-300">months after the first sale</span>
                              </div>
                            </div>
                            <div className="sm:col-span-12">
                              <label htmlFor="minimum_days_payout" className="block text-sm font-medium text-gray-700">
                                Minimum days before payout
                              </label>
                              <div className="mt-1 flex rounded-md shadow-sm items-center justify-between">
                                <input
                                  minLength="1"
                                  maxLength="90"
                                  required
                                  placeholder="30"
                                  type="number"
                                  name="minimum_days_payout"
                                  id="minimum_days_payout"
                                  defaultValue={edit?.minimum_days_payout ? edit?.minimum_days_payout : 30}
                                  className="flex-1 block w-full min-w-0 p-3 rounded-xl focus:outline-none sm:text-md border-2 border-r-0 rounded-tr-none rounded-br-none border-gray-300"
                                />
                                <span className="min-w-0 p-3 rounded-xl focus:outline-none sm:text-md border-2 rounded-tl-none bg-gray-200 rounded-bl-none border-gray-300">days</span>
                              </div>
                            </div>
                          </>
                      }

                      {/* <div className="sm:col-span-12">
                        <label htmlFor="loom_email" className="block text-sm font-medium text-gray-700">
                          Loom Email Address
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <input
                            required
                            placeholder="youremail@example.com"
                            type="text"
                            name="loom_email"
                            id="loom_email"
                            autoComplete="loom_email"
                            className="flex-1 block w-full min-w-0 rounded-md focus:outline-none sm:text-sm border-gray-300"
                          />
                        </div>
                      </div> */}
                  <div className="sm:col-span-12 mt-2">
                    <div className="relative flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="campaign_public"
                          name="campaign_public"
                          type="checkbox"
                          className="focus:ring-primary h-7 w-7 text-secondary border-2 border-gray-300 rounded-full cursor-pointer"
                          defaultChecked={edit && edit?.campaign_public ? edit?.campaign_public : true}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="campaign_public" className="text-sm font-medium text-gray-700 cursor-pointer">
                          Campaign is publicly joinable
                        </label>
                      </div>
                    </div>
                  </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div className="text-center -mb-5">
              <button type="button" onClick={e=>{showAdvancedOptions ? setShowAdvancedOptions(false) : setShowAdvancedOptions(true)}} className="inline-flex bg-white p-3 text-sm font-semibold border-4 border-gray-300 rounded-lg mx-auto">
                {showAdvancedOptions ? '- Hide advanced options' : '+ Show advanced options'}
              </button>
            </div>

            <div className="bg-gray-200 border-t-4 px-6 py-10 space-y-8">
              <div className="sm:col-span-12">
                <div>
                  <p className="text-xl font-bold mb-1">Give new customers a discount</p>
                  <p className="text-md mb-5">Enter the details of a discount code that was created in your Stripe account. Adding a discount code <span className="font-semibold">greatly increases conversion rates</span> for both referral sales, and EU based users giving cookie consent.</p>
                  <div>
                    <div className="space-y-4">
                      <div className="mt-1 flex rounded-md shadow-sm items-center justify-between">
                        <label for="discount_type" className="min-w-0 p-3 rounded-xl focus:outline-none sm:text-md border-2 border-r-0 rounded-tr-none bg-gray-100 rounded-br-none border-gray-300">Discount type:</label>
                        <select defaultValue={discountType ? discountType : edit && edit?.discount_type} onChange={e=>{setDiscountType(e.target.value)}} className="flex-1 block w-full min-w-0 p-3 rounded-xl focus:outline-none sm:text-md border-2 bor border-r-0 rounded-tl-none rounded-bl-none border-gray-300" required="required" name="discount_type" id="discount_type">
                          <option value="percentage">Percentage</option>
                          <option value="fixed">Fixed amount</option>
                        </select>
                      </div>
                      <div className="mt-1 flex rounded-md shadow-sm items-center justify-between">
                        <label for="discount_code" className="min-w-0 p-3 rounded-xl focus:outline-none sm:text-md border-2 border-r-0 rounded-tr-none bg-gray-100 rounded-br-none border-gray-300">Discount code:</label>
                        <input
                          minLength="1"
                          maxLength="100"
                          placeholder="e.g. 10OFF"
                          type="text"
                          name="discount_code"
                          id="discount_code"
                          defaultValue={edit && edit?.discount_code}
                          autoComplete="discount_code"
                          className="flex-1 block w-full min-w-0 p-3 rounded-xl focus:outline-none sm:text-md border-2 bor border-r-0 rounded-tl-none rounded-bl-none border-gray-300"
                        />
                      </div>

                      {
                        discountType === 'percentage' &&
                        <div className="mt-1 flex rounded-md shadow-sm items-center justify-between">
                          <label for="discount_value" className="min-w-0 p-3 rounded-xl focus:outline-none sm:text-md border-2 border-r-0 rounded-tr-none bg-gray-100 rounded-br-none border-gray-300">Discount percentage:</label>
                          <input
                            minLength="1"
                            maxLength="100"
                            placeholder="15"
                            type="number"
                            name="discount_value"
                            id="discount_value"
                            defaultValue={edit && edit?.discount_value}
                            autoComplete="discount_value"
                            className="flex-1 block w-full min-w-0 p-3 focus:outline-none sm:text-md border-2 border-r-0 rounded-none border-gray-300"
                          />
                          <span className="min-w-0 p-3 rounded-xl focus:outline-none sm:text-md border-2 rounded-tl-none bg-gray-200 rounded-bl-none border-gray-300">%</span>
                        </div>
                      }

                      {
                        discountType === 'fixed' &&
                        <div className="mt-1 flex rounded-md shadow-sm items-center justify-between">
                          <label for="discount_value" className="min-w-0 p-3 rounded-xl focus:outline-none sm:text-md border-2 border-r-0 rounded-tr-none bg-gray-100 rounded-br-none border-gray-300">Discount amount: {activeCompany?.company_currency}</label>
                          <input
                            minLength="1"
                            maxLength="100"
                            placeholder="15"
                            type="number"
                            name="discount_value"
                            id="discount_value"
                            defaultValue={edit && edit?.discount_value}
                            autoComplete="discount_value"
                            className="flex-1 block w-full min-w-0 p-3 focus:outline-none sm:text-md border-2 border-l-0 rounded-tl-none rounded-bl-none rounded-xl border-gray-300"
                          />
                        </div>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t-4 px-6 py-8 space-y-8">
              <div className="sm:col-span-12">
                <div className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="default_campaign"
                      name="default_campaign"
                      type="checkbox"
                      className="focus:ring-primary h-7 w-7 text-secondary border-2 border-gray-400 rounded-full cursor-pointer"
                      defaultChecked={edit && edit?.default_campaign ? true : false}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="default_campaign" className="text-sm font-medium text-gray-700 cursor-pointer">
                      Set as default campaign
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t-4 px-6 py-8 bg-white flex items-center justify-start relative">
              <Button
                large
                primary
                disabled={loading}
              >
                <span>{loading ? edit ? 'Editing Campaign...' : 'Creating Campaign...' : edit ? 'Save Changes' : 'Create Campaign'}</span>
              </Button>
            </div>
          </form>
        :
          <LoadingDots/>
      }
    </div>
  )
};

export default CampaignForm;