import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useUser } from '@/utils/useUser';
import LoadingDots from '@/components/ui/LoadingDots';
import SEOMeta from '@/components/SEOMeta'; 
import { useUserAffiliate } from '@/utils/UserAffiliateContext';

export default function DashboardPage() {
  const router = useRouter();
  const { user, userFinderLoaded } = useUser();
  const { userAffiliateDetails, userAffiliateInvites } = useUserAffiliate();

  useEffect(() => {
    if(userFinderLoaded){
      if (!user) router.replace('/signin');
    }
  }, [userFinderLoaded, user]);

  return (
    <>
      <SEOMeta title="Referrals"/>
      <div className="pt-12 wrapper">
        <LoadingDots/>
      </div>
    </>
  );
}