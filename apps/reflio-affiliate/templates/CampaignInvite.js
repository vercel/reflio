import { useState } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '../utils/useUser';
import { useUserAffiliate } from '../utils/UserAffiliateContext';
import LoadingTile from '@/components/LoadingTile';
import {
  ArrowNarrowLeftIcon
} from '@heroicons/react/outline';
import Button from '@/components/Button'; 
import toast from 'react-hot-toast';
import { postData } from '../utils/helpers';

export default function CampaignInvite() {
  const router = useRouter();
  const { user, session } = useUser();
  const { userAffiliateDetails, publicCampaignData } = useUserAffiliate();
  const [loading, setLoading] = useState(false);
  const [campaignAlreadyJoined, setCampaignAlreadyJoined] = useState(false);

  if(campaignAlreadyJoined === false && user && publicCampaignData !== null && userAffiliateDetails !== null && userAffiliateDetails?.length > 0 && JSON.stringify(userAffiliateDetails).includes(publicCampaignData?.campaign_id)){
    setCampaignAlreadyJoined(true);
  }

  const handleCampaignJoin = async (companyId, campaignId) => {    
    setLoading(true);

    try {
      const { status } = await postData({
        url: '/api/affiliate/campaign-join',
        data: { 
          companyId: companyId,
          campaignId: campaignId
        },
        token: session.access_token
      });
      
      if(status === "success"){
        setLoading(false);
        toast.success(`Congratulations! You have joined campaign ${publicCampaignData?.campaign_name}`)
        router.replace('/dashboard');
      }

      if(status === "private"){
        setLoading(false);
        toast.error('This campaign is private. Please contact the campaign owner for an invite.')
      }
  
    } catch (error) {
      setLoading(false);
      toast.error('There was an error when joining the campaign. Please try again later, or contact support.')
    }
  };
  
  return(
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
      <div className="wrapper">
        <div className="py-12">
          {
            publicCampaignData !== null ?
              <div className="text-center">
                <div>
                  {
                    publicCampaignData?.company_image !== null ?
                      <img alt={`${publicCampaignData?.company_name} Logo`} src={process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL+publicCampaignData?.company_image} className="h-12 w-auto mx-auto mb-2"/>
                    :
                      <h1 className="text-4xl font-semibold mb-2">{publicCampaignData?.company_name}</h1>
                  }
                  <>
                    <div className="mb-12">
                      <h2 className="text-xl text-gray-400">{publicCampaignData?.campaign_name}</h2>
                    </div>
                    <div className="p-8 rounded-xl bg-white shadow-lg border-4 border-gray-200 max-w-2xl mx-auto">
                      {
                        publicCampaignData?.campaign_public === true &&
                        <p className="text-lg mb-5 text-gray-500">{publicCampaignData?.commission_type === 'percentage' ? `${publicCampaignData?.commission_value}% commission on all paid referrals.` : `${publicCampaignData?.company_currency}${publicCampaignData?.commission_value} commission on all paid referrals.`}</p> 
                      }
                      {
                        user ?
                          <div>
                            {
                              campaignAlreadyJoined === true ?
                                <div className="p-3 rounded-xl bg-green-600 text-white text-lg font-semibold">You have already joined this campaign.</div>
                              : publicCampaignData?.campaign_public === true ?
                                <Button
                                  onClick={e=>{handleCampaignJoin(publicCampaignData?.company_id, publicCampaignData?.campaign_id)}}
                                  disabled={loading}
                                  secondary
                                  large
                                >
                                  {loading ? 'Joining campaign...' : 'Join campaign'}
                                </Button>
                              :
                                <p className="text-lg">This campaign is not public, and requires a manual invite for you to join. Please contact <span className="font-bold">{publicCampaignData?.company_name}</span> to request an invite.</p>
                            }
                          </div>
                        :
                          <div>
                            <Button
                              href={`/signup?campaign_id=${publicCampaignData?.campaign_id}&company_name=${publicCampaignData?.company_name}`}
                              secondary
                              large
                            >
                              Join Campaign
                            </Button>
                          </div>
                      }
                    </div>
                  </>
                </div>
              </div>
            : 
              <div>
                <LoadingTile/>
              </div>
          }
        </div>
      </div>
    </div>
  )
}