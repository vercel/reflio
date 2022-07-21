import LoadingDots from '@/components/LoadingDots';
import SEOMeta from '@/components/SEOMeta'; 

export default function DashboardPage() {
  return (
    <>
      <SEOMeta title="Referrals"/>
      <div className="pt-12 wrapper">
        <LoadingDots/>
      </div>
    </>
  );
}