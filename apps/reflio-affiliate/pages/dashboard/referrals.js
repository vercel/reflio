import LoadingTile from '@/components/LoadingTile';
import SEOMeta from '@/templates/SEOMeta'; 

const ReferralsPage = () => {
  return (
    <>
      <SEOMeta title="Referrals"/>
      <div className="pt-12 wrapper">
        <LoadingTile/>
      </div>
    </>
  );
};

export default ReferralsPage;