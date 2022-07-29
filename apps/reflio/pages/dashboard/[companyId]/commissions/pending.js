import { SEOMeta } from '@/templates/SEOMeta'; 
import { CommissionsTemplate } from '@/components/CommissionsTemplate'; 

export default function CommissionsPendingPage() {
  return (
    <>
      <SEOMeta title="Pending Commissions"/>
      <CommissionsTemplate page="pending"/>
    </>
  );
}