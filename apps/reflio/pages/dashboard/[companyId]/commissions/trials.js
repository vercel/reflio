import { SEOMeta } from '@/templates/SEOMeta'; 
import { CommissionsTemplate } from '@/components/CommissionsTemplate'; 

export default function CommissionsTrialPage() {
  return (
    <>
      <SEOMeta title="Trial Commissions"/>
      <CommissionsTemplate page="trial"/>
    </>
  );
}