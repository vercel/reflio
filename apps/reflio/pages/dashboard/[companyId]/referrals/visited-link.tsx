import { SEOMeta } from '@/templates/SEOMeta'; 
import { ReferralsTemplate } from '@/components/ReferralsTemplate'; 

export default function ReferralsPageVisitedLink() {
  return (
    <>
      <SEOMeta title="All Referrals"/>
      <ReferralsTemplate page="visited-link"/>
    </>
  );
}