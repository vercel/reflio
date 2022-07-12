import LoadingTile from '@/components/ui/LoadingTile';
import SEOMeta from '@/components/SEOMeta'; 

export default function DashboardPage() {
  return (
    <>
      <SEOMeta title="Dashboard"/>
      <div className="pt-12 wrapper">
        <LoadingTile/>
      </div>
    </>
  );
}