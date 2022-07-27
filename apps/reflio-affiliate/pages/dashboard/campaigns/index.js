import SEOMeta from '@/templates/SEOMeta'; 
import CampaignsList from '@/components/CampaignsList'; 

export default function CampaignsPage() {
  return (
    <>
      <SEOMeta title="Campaigns"/>
      <div className="py-10">
        <CampaignsList/>
      </div>
    </>
  );
}