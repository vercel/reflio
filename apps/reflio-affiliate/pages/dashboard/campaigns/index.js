import SEOMeta from '@/templates/SEOMeta'; 
import CampaignsList from '@/components/CampaignsList'; 

const CampaignsPage = () => {
  return (
    <>
      <SEOMeta title="Campaigns"/>
      <div className="py-10">
        <CampaignsList/>
      </div>
    </>
  );
};

export default CampaignsPage;