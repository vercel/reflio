import { useRouter } from 'next/router';
import SetupProgress from '@/components/SetupProgress'; 
import { SEOMeta } from '@/templates/SEOMeta'; 
import Button from '@/components/Button'; 
import { useCompany } from 'utils/CompanyContext';
import { useCampaign } from 'utils/CampaignContext';
import CampaignForm from 'forms/CampaignForm'; 
import { priceString } from 'utils/helpers';

export default function AddCompany() {
  const router = useRouter();
  const { activeCompany } = useCompany();
  const { userCampaignDetails } = useCampaign();

  return (
    <>
      <SEOMeta title="Create a Campaign"/>
      <div className="py-12 border-b-4 border-gray-300">
        <div className="wrapper">
          <SetupProgress/>
        </div>
      </div>
      <div className="pt-12 mb-6">
        <div className="wrapper">
          <h1 className="text-2xl sm:text-3xl tracking-tight font-extrabold">Create a campaign</h1>
        </div>
      </div>
      <div className="wrapper">
        {
          userCampaignDetails !== null && userCampaignDetails?.length > 0 ?
            <div>
              <p className="text-lg mb-3">Your first campaign is ready.</p>
              <div className="mb-3">
                <p className="text-xl leading-6 font-semibold text-gray-900">Campaign name:</p>
                <p>{userCampaignDetails[0]?.campaign_name}</p>
              </div>
              <div className="mb-3">
                <p className="text-xl leading-6 font-semibold text-gray-900">Commission:</p>
                {
                  userCampaignDetails[0]?.commission_type === "percentage" ?
                    <p>{userCampaignDetails[0]?.commission_value}%</p>
                  :
                    <p>{priceString(userCampaignDetails[0]?.commission_value, activeCompany?.company_currency)}</p>
                }
                <p>{userCampaignDetails[0]?.commi}</p>
              </div>
              <div className="mb-8">
                <a className="underline font-semibold" href={`/dashboard/${router?.query?.companyId}/campaigns/${userCampaignDetails[0]?.campaign_id}/edit`}>Edit campaign</a>
              </div>
              <div className="pt-8 border-t-4">
                <Button
                  large
                  primary
                  href={`/dashboard/${router?.query?.companyId}/setup/add`}
                >
                  <span>Next step</span>
                </Button>
              </div>
            </div>
          :
            <CampaignForm setupMode={true}/>
        }
      </div>
    </>
  );
}