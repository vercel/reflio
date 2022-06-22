import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useUser } from '@/utils/useUser';
import LoadingDots from '@/components/ui/LoadingDots';
import SEOMeta from '@/components/SEOMeta'; 

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
      <SEOMeta title="Dashboard"/>
      <div className="pt-12 wrapper">
        <LoadingDots/>
      </div>
    </>
  );
}