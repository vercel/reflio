import { useRouter } from 'next/router';
import { useCompany } from 'utils/CompanyContext';
import LoadingDots from '@/components/LoadingDots';
import { SEOMeta } from '@/templates/SEOMeta'; 

export default function InnerDashboardPage() {
  const router = useRouter();
  const { activeCompany } = useCompany();

  if(activeCompany?.stripe_account_data === null || activeCompany?.stripe_id === null){
    router.replace(`/dashboard/${router?.query?.companyId}/setup`);
  } else {
    router.replace(`/dashboard/${router?.query?.companyId}/campaigns`);
  }
  
  return (
    <>
      <SEOMeta title="Dashboard"/>
      <div className="pt-12 wrapper">
        <LoadingDots/>
      </div>
    </>
  );
}