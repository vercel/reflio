import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useUser } from '@/utils/useUser';
import LoadingDots from '@/components/ui/LoadingDots';
import SEOMeta from '@/components/SEOMeta'; 
import AffiliateInvites from '@/components/ui/AffiliateInvites'; 
import CampaignsList from '@/components/ui/CampaignsList'; 

export default function CampaignsPage() {
  const router = useRouter();
  const { user, userFinderLoaded } = useUser();

  useEffect(() => {
    if(userFinderLoaded){
      if (!user) router.replace('/signin');
    }
  }, [userFinderLoaded, user]);

  return (
    <>
      <SEOMeta title="Campaigns"/>
      <div className="py-10">
        <CampaignsList/>
      </div>
    </>
  );
}