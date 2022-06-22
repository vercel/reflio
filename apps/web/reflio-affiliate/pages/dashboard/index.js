import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useUser } from '@/utils/useUser';
import LoadingDots from '@/components/ui/LoadingDots';
import SEOMeta from '@/components/SEOMeta'; 
import AffiliateInvites from '@/components/ui/AffiliateInvites'; 
import CampaignsList from '@/components/ui/CampaignsList'; 

export default function DashboardPage() {
  const router = useRouter();
  const { user, userFinderLoaded } = useUser();

  useEffect(() => {
    if(userFinderLoaded){
      if (!user) router.replace('/signin');
    }
  }, [userFinderLoaded, user]);

  return (
    <>
      <SEOMeta title="Affiliate Dashboard"/>
      <div className="pb-10 mb-12 border-b-4">
        <div className="pt-10 wrapper">
          <h1 className="text-2xl sm:text-3xl tracking-tight font-extrabold">Dashboard</h1>
        </div>
      </div>
      <div>
        <div className="mb-14">
          <CampaignsList/>
        </div>
        <AffiliateInvites/>
      </div>
    </>
  );
}