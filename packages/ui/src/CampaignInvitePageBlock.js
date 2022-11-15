import { useRouter } from 'next/router';
import AuthForm from '@/components/AuthForm';
import LoadingTile from '@/components/LoadingTile';
import Button from '@/components/Button';  
import toast from 'react-hot-toast';
import { postData } from '@/utils/helpers';

export const CampaignInvitePageBlock = ({ publicCampaignData, campaignAlreadyJoined, loading, setLoading, user, session, editor, editorData }) => {
  const router = useRouter();

  let customCampaignData = null;

  if(publicCampaignData?.custom_campaign_data !== null){
    customCampaignData = publicCampaignData?.custom_campaign_data;
  }
  if(editor === true && editorData !== null){
    customCampaignData = editorData;
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

  return (
    <>
      <div>
        {
          editor &&
          <div className="bg-red-400 text-white inline-flex py-1 px-3 text-sm font-bold rounded-full">
            PREVIEW MODE
          </div>
        }
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
                      <div>
                        {
                          customCampaignData !== null && customCampaignData?.campaign_welcome_message !== null ?
                            <p className="text-lg mb-5 text-gray-500">{customCampaignData?.campaign_welcome_message}</p>
                          :
                            <p className="text-lg mb-5 text-gray-500">
                              Join <span className="font-semibold text-gray-700">{publicCampaignData?.campaign_name}</span> and get {publicCampaignData?.commission_type === 'percentage' ? `${publicCampaignData?.commission_value}% commission on all paid referrals.` : `${publicCampaignData?.company_currency}${publicCampaignData?.commission_value} commission on all paid referrals.`}
                            </p> 
                        }
                      </div>
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
                          <AuthForm editor={editor} affiliate={true} type="signup" campaignId={publicCampaignData?.campaign_id} campaignHandle={router?.query?.handle} hideDetails={true}/>
                          {/* <Button
                            href={`/signup?campaign_id=${publicCampaignData?.campaign_id}&company_name=${publicCampaignData?.company_name}`}
                            secondary
                            large
                          >
                            Join Campaign
                          </Button> */}
                        </div>
                    }
                  </div>
                </>
              </div>
              <div className="mt-12">
                <p className="text-sm text-gray-500">{publicCampaignData?.campaign_name} is powered by <a target="_blank" className="font-semibold underline" href={`https://reflio.com?ref=${publicCampaignData?.campaign_name}`} rel="noreferrer">Reflio</a></p>
              </div>
            </div>
          : 
            <div>
              <LoadingTile/>
            </div>
        }
      </div>
    </>
  );
};

export default CampaignInvitePageBlock;          
          