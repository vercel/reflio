import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useUser } from '@/utils/useUser';
import setupStepCheck from '@/utils/setupStepCheck';
import LoadingDots from '@/components/ui/LoadingDots'; 

export default function SetupPage() {
  const router = useRouter();
  const { user, userFinderLoaded } = useUser();
  setupStepCheck();

  useEffect(() => {
    if(userFinderLoaded){
      if (!user) router.replace('/signin');
    }
  }, [userFinderLoaded, user]);

  return (
    <div className="pt-12 wrapper">
      <LoadingDots/>
    </div>
  );
}