import { SEOMeta } from '@/templates/SEOMeta'; 
import { ReferralsTemplate } from '@/components/ReferralsTemplate'; 

export default function ReferralsPageSignedUp() {
  return (
    <>
      <SEOMeta title="All Referrals"/>
      <ReferralsTemplate page="signed-up"/>
    </>
  );
}