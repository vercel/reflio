import { useRouter } from 'next/router';
import { useState } from 'react';
import { useCompany } from '@/utils/CompanyContext';
import LoadingTile from '@/components/LoadingTile';
import Button from '@/components/Button'; 
import { SEOMeta } from '@/templates/SEOMeta'; 
import { useUser } from '@/utils/useUser';

export default function BillingPage() {
  const router = useRouter();
  const { user, planDetails } = useUser();
  const { activeCompany } = useCompany();
  const [loading, setLoading] = useState(false);

  return (
    <>
      <SEOMeta title="Plan"/>
      <div className="mb-8">
        <div className="pt-10 wrapper">
          <h1 className="text-2xl sm:text-3xl tracking-tight font-extrabold mb-3">Billing / Plans</h1>
          <p>{planDetails}</p>
        </div>
      </div>
      <div className="wrapper">
      </div>
    </>
  );
}