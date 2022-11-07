import { SEOMeta } from '@/templates/SEOMeta'; 
import { ReferralsTemplate } from '@/components/ReferralsTemplate'; 

export default function ReferralsPageExpired() {
  return (
    <>
      <SEOMeta title="All Referrals"/>
      <ReferralsTemplate page="expired"/>
    </>
  );
}