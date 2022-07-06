import LoadingDots from '@/components/ui/LoadingDots';
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