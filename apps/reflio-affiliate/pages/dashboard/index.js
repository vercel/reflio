import SEOMeta from '@/templates/SEOMeta'; 
import AffiliateInvites from '@/components/AffiliateInvites'; 
import CampaignsList from '@/components/CampaignsList'; 

const DashboardPage = () => {
  return (
    <>
      <SEOMeta title="Affiliate Dashboard"/>
      <div className="pb-10 mb-12 border-b-4">
        <div className="pt-10 wrapper">
          <h1 className="text-2xl sm:text-3xl tracking-tight font-extrabold">Dashboard</h1>
        </div>
      </div>
      <div>
        <div className="mb-14">
          <CampaignsList/>
        </div>
        <AffiliateInvites/>
      </div>
    </>
  );
};

export default DashboardPage;