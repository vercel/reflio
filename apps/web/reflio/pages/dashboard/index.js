import { useRouter } from 'next/router';
import LoadingDots from '@/components/ui/LoadingDots';
import SEOMeta from '@/components/SEOMeta'; 

export default function DashboardPage() {
  return (
    <>
      <SEOMeta title="Dashboard"/>
      <div className="pt-12 wrapper">
        <LoadingDots/>
      </div>
    </>
  );
}