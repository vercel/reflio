/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@/utils/useUser';
import { useUserAffiliate } from '@/utils/UserAffiliateContext';
import {
  ArrowNarrowLeftIcon
} from '@heroicons/react/outline';
import CampaignInvitePageBlock from '@/components/CampaignInvitePageBlock'; 

export default function CampaignInvite({ publicCampaignData }) {
  const router = useRouter();
  const { user, session } = useUser();
  const { userAffiliateDetails } = useUserAffiliate();
  const [loading, setLoading] = useState(false);
  const [campaignAlreadyJoined, setCampaignAlreadyJoined] = useState(false);

  if(campaignAlreadyJoined === false && user && publicCampaignData !== null && userAffiliateDetails !== null && userAffiliateDetails?.length > 0 && JSON.stringify(userAffiliateDetails).includes(publicCampaignData?.campaign_id)){
    setCampaignAlreadyJoined(true);
  }

  if(router?.asPath.includes('campaignRedirect=true')){
    if (typeof window !== "undefined") {
      localStorage.removeItem('join_campaign_details');
    }
  }
  
  return(
    <>
      <div>
        {
          user &&
          <div className="w-full bg-gray-200 border-b-4 border-gray-300 py-4">
            <div className="wrapper">
              <a className="font-semibold flex items-center" href="/dashboard">
                <ArrowNarrowLeftIcon className="w-7 h-auto"/>
                <span className="ml-2">Back to Dashboard</span>
              </a>
            </div>
          </div>
        }
        <div className="wrapper py-12">
          <CampaignInvitePageBlock 
            publicCampaignData={publicCampaignData}
            campaignAlreadyJoined={campaignAlreadyJoined} 
            loading={loading}
            setLoading={setLoading}
            user={user}
            session={session}
          />
        </div>
      </div>
    </>
  )
}