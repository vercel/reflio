import { SEOMeta } from '@/templates/SEOMeta'; 
import { ReferralsTemplate } from '@/components/ReferralsTemplate'; 

export default function ReferralsPageConverted() {
  return (
    <>
      <SEOMeta title="All Referrals"/>
      <ReferralsTemplate page="converted"/>
    </>
  );
}