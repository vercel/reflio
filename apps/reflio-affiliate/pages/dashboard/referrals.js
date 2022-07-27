import LoadingDots from '@/components/LoadingDots';
import SEOMeta from '@/templates/SEOMeta'; 

const ReferralsPage = () => {
  return (
    <>
      <SEOMeta title="Referrals"/>
      <div className="pt-12 wrapper">
        <LoadingDots/>
      </div>
    </>
  );
};

export default ReferralsPage;