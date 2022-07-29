import { SEOMeta } from '@/templates/SEOMeta'; 
import { CommissionsTemplate } from '@/components/CommissionsTemplate'; 

export default function CommissionsDuePage() {
  return (
    <>
      <SEOMeta title="Due Commissions"/>
      <CommissionsTemplate page="due"/>
    </>
  );
}