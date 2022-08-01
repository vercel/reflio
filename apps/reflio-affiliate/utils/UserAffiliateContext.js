/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router';
import { useState, useEffect, createContext, useContext } from 'react';
import { useUser } from '@/utils/useUser';
import { postData } from '@/utils/helpers';

export const UserAffiliateContext = createContext();

export const UserAffiliateContextProvider = (props) => {
  const { user, userFinderLoaded, session } = useUser();
  const [userAffiliateDetails, setUserAffiliateDetails] = useState(null);
  const [userAffiliateInvites, setUserAffiliateInvites] = useState(null);
  const [publicCampaignData, setPublicCampaignData] = useState(null);
  const [loadingAffiliates, setLoadingAffiliates] = useState(false);
  const [loadingAffiliateInvites, setLoadingAffiliateInvites] = useState(false);
  const [publicCampaignDataLoading, setPublicCampaignDataLoading] = useState(false);
  const router = useRouter();
  let value;

  const affiliatePrograms = async () => {    
    try {
      const { programs } = await postData({
        url: '/api/affiliate/campaigns',
        token: session.access_token
      });

      setUserAffiliateDetails(programs);
      
    } catch (error) {
      console.log(error)
    }
  };

  const affiliateInvites = async () => {    
    try {
      const { invites } = await postData({
        url: '/api/affiliate/invites',
        token: session.access_token
      });

      setUserAffiliateInvites(invites);
  
    } catch (error) {
      console.log(error)
    }
  };

  const campaignData = async (companyHandle) => {    
    if(!companyHandle) return false;

    try {
      const { campaign } = await postData({
        url: '/api/public/campaign',
        data: {
          "companyHandle": companyHandle,
          "campaignId": router?.query?.campaignId ? router?.query?.campaignId : null
        }
      });

      setPublicCampaignData(campaign);
  
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    if (userFinderLoaded && user && userAffiliateDetails === null && loadingAffiliates === false) {
      setLoadingAffiliates(true);
      affiliatePrograms();
    }

    if (userFinderLoaded && user && userAffiliateInvites === null && loadingAffiliateInvites === false) {
      setLoadingAffiliateInvites(true);
      affiliateInvites();
    }

    if (publicCampaignData === null && publicCampaignDataLoading === false && router?.query?.handle) {
      setPublicCampaignDataLoading(true);
      campaignData(router?.query?.handle);
    }
  });

  value = {
    userAffiliateDetails,
    userAffiliateInvites,
    publicCampaignData
  };

  return <UserAffiliateContext.Provider value={value} {...props}  />;
}

export const useUserAffiliate = () => {
  const context = useContext(UserAffiliateContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a UserAffiliateContextProvider.`);
  }
  return context;
};