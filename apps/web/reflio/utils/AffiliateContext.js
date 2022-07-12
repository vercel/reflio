import { useRouter } from 'next/router';
import { useState, useEffect, createContext, useContext } from 'react';
import { getAffiliates, useUser } from '@/utils/useUser';
import { useCompany } from '@/utils/CompanyContext';
import { useCampaign } from '@/utils/CampaignContext';

export const AffiliateContext = createContext();

export const AffiliateContextProvider = (props) => {
  const { user, userFinderLoaded } = useUser();
  const { activeCompany } = useCompany();
  const { userCampaignDetails } = useCampaign();
  const [userAffiliateDetails, setUserAffiliateDetails] = useState(null);
  const [mergedAffiliateDetails, setMergedAffiliateDetails] = useState(null);
  let value;

  useEffect(() => {
    if (userFinderLoaded && getAffiliates && user && userAffiliateDetails === null && activeCompany?.company_id) {
      getAffiliates(activeCompany?.company_id).then(results => {
        setUserAffiliateDetails(Array.isArray(results) ? results : [results])
      });
    }
  });

  if(mergedAffiliateDetails === null && userCampaignDetails !== null && userCampaignDetails?.length && userAffiliateDetails !== null && userAffiliateDetails?.length && activeCompany?.company_id ){
    let clonedAffiliateDetails = userAffiliateDetails;

    clonedAffiliateDetails?.map(affiliate =>{
      userCampaignDetails?.map(campaign =>{
        if(affiliate?.campaign_id === campaign?.campaign_id){
          affiliate.campaign_name = campaign.campaign_name;
        }
      })
    });

    setMergedAffiliateDetails(clonedAffiliateDetails);
  }

  if(userAffiliateDetails !== null && userAffiliateDetails?.length === 0 && mergedAffiliateDetails === null){
    setMergedAffiliateDetails([]);
  }

  value = {
    userAffiliateDetails,
    mergedAffiliateDetails
  };

  return <AffiliateContext.Provider value={value} {...props}  />;
}

export const useAffiliate = () => {
  const context = useContext(AffiliateContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a AffiliatesContextProvider.`);
  }
  return context;
};