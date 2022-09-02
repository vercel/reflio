import CampaignInvite from '@/templates/CampaignInvite';
import { postData } from '@/utils/helpers';
import SEOMeta from '@/templates/SEOMeta';
import { useRouter } from 'next/router';

function CampaignInviteIndex({ publicCampaignData }){
  const router = useRouter();
  
  let campaignImageUrl = `/api/public/campaign-image?companyHandle=${router?.query?.handle}`

  return(
    <>
      <SEOMeta 
        title={`${publicCampaignData?.campaign_name}`}
        img={campaignImageUrl}
      />
      <CampaignInvite publicCampaignData={publicCampaignData} />
    </>
  )
};

export async function getServerSideProps({ query }) {
  
  const { handle } = query
  
  const { campaign } = await postData({
    url: `${process.env.NEXT_PUBLIC_AFFILIATE_SITE_URL}/api/public/campaign`,
    data: {
      "companyHandle": handle ? handle : null,
      "campaignId": null
    }
  });

  return { props: { publicCampaignData: campaign } }
}

export default CampaignInviteIndex;