import { useRouter } from 'next/router';
import { useCompany } from './CompanyContext';
import { useCampaign } from './CampaignContext';

export default function setupStepCheck(type) {
  const router = useRouter();
  const { activeCompany } = useCompany();
  const { userCampaignDetails } = useCampaign();

  const replaceUrl = (url) => {
    if(router.asPath === `/dashboard/${router?.query?.companyId}${url}`) return false;

    console.log('ok')
    console.log(`/dashboard/${router?.query?.companyId}${url}`)

    router.replace(`/dashboard/${router?.query?.companyId}${url}`);
  }

  if(activeCompany){
    if(type === 'light'){
      if(activeCompany?.stripe_account_data === null || activeCompany?.stripe_id === null){
        replaceUrl('/setup/stripe');
      }
    
      if(activeCompany?.stripe_account_data !== null && activeCompany?.stripe_id !== null && activeCompany?.company_currency === null){
        replaceUrl('/setup/currency');
      }

    } else {
      if(activeCompany?.stripe_account_data === null || activeCompany?.stripe_id === null){
        replaceUrl('/setup/stripe');
      }
    
      if(activeCompany?.stripe_account_data !== null && activeCompany?.stripe_id !== null && activeCompany?.company_currency === null){
        replaceUrl('/setup/currency');
      }
    
      if(activeCompany?.stripe_account_data !== null && activeCompany?.stripe_id !== null && activeCompany?.company_currency !== null && userCampaignDetails?.length === 0){
        replaceUrl('/setup/campaign');
      }
    
      if(activeCompany?.stripe_account_data !== null && activeCompany?.stripe_id !== null && activeCompany?.company_currency !== null && userCampaignDetails !== null && userCampaignDetails?.length > 0 && activeCompany?.domain_verified !== true){
        replaceUrl('/setup/add');
      }
  
      if(activeCompany?.domain_verified === true){
        replaceUrl('/setup/verify');
      }
    }
  }
}