import { useRouter } from 'next/router';
import { useState, useEffect, createContext, useContext } from 'react';
import { getCampaigns, useUser } from '@/utils/useUser';
import { useCompany } from '@/utils/CompanyContext';

export const CampaignContext = createContext();

export const CampaignContextProvider = (props) => {
  const { user, userFinderLoaded, signOut } = useUser();
  const { activeCompany } = useCompany();
  const [userCampaignDetails, setUserCampaignDetails] = useState(null);
  const [activeCampaign, setActiveCampaign] = useState('none');
  const router = useRouter();
  let value;

  useEffect(() => {
    if(userFinderLoaded){
      if (!user) router.replace('/signin');
    }
  }, [userFinderLoaded, user]);

  useEffect(() => {
    if (userFinderLoaded && getCampaigns && user && userCampaignDetails === null && activeCompany?.company_id) {
      Promise.allSettled([getCampaigns(activeCompany?.company_id)]).then(
        (results) => {
          setUserCampaignDetails(Array.isArray(results[0].value) ? results[0].value : [results[0].value])

          let newActiveCampaign = null;

          if(router?.query?.campaignId && results[0].value?.filter(campaign => campaign?.campaign_id === router?.query?.campaignId)?.length && activeCampaign === 'none' && results[0].value){
            newActiveCampaign = results[0].value?.filter(campaign => campaign?.campaign_id === router?.query?.campaignId);
            if( Array.isArray(newActiveCampaign) && newActiveCampaign !== null){
              newActiveCampaign = newActiveCampaign[0];
            }
          }            

          if(newActiveCampaign !== null){
            setActiveCampaign(newActiveCampaign);
          } else {
            setActiveCampaign(null);
          }
        }
      );
    }
  });
  
  console.log(activeCampaign);
  
  value = {
    activeCampaign,
    userCampaignDetails
  };

  return <CampaignContext.Provider value={value} {...props}  />;
}

export const useCampaign = () => {
  const context = useContext(CampaignContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a CampaignsContextProvider.`);
  }
  return context;
};