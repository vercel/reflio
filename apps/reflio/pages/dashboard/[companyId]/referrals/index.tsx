import { SEOMeta } from '@/templates/SEOMeta'; 
import { ReferralsTemplate } from '@/components/ReferralsTemplate'; 

export default function ReferralsPage() {
  return (
    <>
      <SEOMeta title="All Referrals"/>
      <ReferralsTemplate page="index"/>
    </>
  );
}