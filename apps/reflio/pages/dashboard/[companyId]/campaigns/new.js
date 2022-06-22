import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useUser } from '@/utils/useUser';
import { useCompany } from '@/utils/CompanyContext';
import CampaignForm from '@/components/ui/Forms/CampaignForm';
import SEOMeta from '@/components/SEOMeta'; 
import Button from '@/components/ui/Button'; 
import {
  ArrowNarrowLeftIcon
} from '@heroicons/react/outline';

export default function CreateCampaignPage() {
  const router = useRouter();
  const { user, userFinderLoaded } = useUser();
  const { activeCompany } = useCompany();

  useEffect(() => {
    if(userFinderLoaded){
      if (!user) router.replace('/signin');
    }
  }, [userFinderLoaded, user, activeCompany]);

  return (
    <>
      <SEOMeta title="Create a campaign"/>
      <div>
        <div className="py-8 border-b-4">
          <div className="wrapper">
            <Button
              href={`/dashboard/${router?.query?.companyId}/campaigns`}
              small
              gray
            >
              <ArrowNarrowLeftIcon className="mr-2 w-6 h-auto"/>
              <span>Back to campaigns</span>
            </Button>
          </div>
        </div>
        <div className="wrapper pt-12">
          <h1 className="text-2xl sm:text-3xl tracking-tight font-extrabold mb-6">Create a new campaign</h1>
          <CampaignForm/>
        </div>
      </div>
    </>
  );
}