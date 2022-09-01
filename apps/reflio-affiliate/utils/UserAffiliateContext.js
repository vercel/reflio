/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, createContext, useContext } from 'react';
import { useUser } from '@/utils/useUser';
import { postData } from '@/utils/helpers';

export const UserAffiliateContext = createContext();

export const UserAffiliateContextProvider = (props) => {
  const { user, userFinderLoaded, session } = useUser();
  const [userAffiliateDetails, setUserAffiliateDetails] = useState(null);
  const [userAffiliateInvites, setUserAffiliateInvites] = useState(null);
  const [referralDetails, setReferralDetails] = useState(null);
  const [loadingAffiliates, setLoadingAffiliates] = useState(false);
  const [loadingAffiliateInvites, setLoadingAffiliateInvites] = useState(false);
  let value;

  const affiliatePrograms = async () => {    
    try {
      const { affilateData, referralsData } = await postData({
        url: '/api/affiliate/campaigns',
        token: session.access_token
      });

      setUserAffiliateDetails(affilateData);
      setReferralDetails(referralsData)
      
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

  useEffect(() => {
    if (userFinderLoaded && user && userAffiliateDetails === null && loadingAffiliates === false) {
      setLoadingAffiliates(true);
      affiliatePrograms();
    }

    if (userFinderLoaded && user && userAffiliateInvites === null && loadingAffiliateInvites === false) {
      setLoadingAffiliateInvites(true);
      affiliateInvites();
    }
  });

  value = {
    userAffiliateDetails,
    userAffiliateInvites,
    referralDetails
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