import SEOMeta from '@/components/SEOMeta'; 
import CampaignsList from '@/components/ui/CampaignsList'; 

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