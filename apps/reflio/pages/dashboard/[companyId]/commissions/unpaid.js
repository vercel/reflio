import { SEOMeta } from '@/templates/SEOMeta'; 
import { CommissionsTemplate } from '@/components/CommissionsTemplate'; 

export default function CommissionsUnpaidPage() {
  return (
    <>
      <SEOMeta title="Sales"/>
      <CommissionsTemplate page="unpaid"/>
    </>
  );
}