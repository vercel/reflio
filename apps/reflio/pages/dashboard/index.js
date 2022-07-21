import { LoadingTile } from '@/components/LoadingTile';
import SEOMeta from '@/templates/SEOMeta'; 

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