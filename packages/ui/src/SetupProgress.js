import { useRouter } from 'next/router';
import { useCompany } from '@/utils/CompanyContext';
import { useCampaign } from '@/utils/CampaignContext';
import LoadingDots from '@/components/LoadingDots';
import setupStepCheck from '@/utils/setupStepCheck';

export const SetupProgress = (props) => {
  setupStepCheck('light');

  const router = useRouter();
  const { activeCompany } = useCompany();
  const { userCampaignDetails } = useCampaign();
  const companyId = router?.query?.companyId ? router?.query?.companyId : null;
  let editCompany, connectStripe, chooseCurrency, createCampaign, companyVerified = null;

  if(activeCompany){
    editCompany = 'complete';

    if(activeCompany?.stripe_account_data !== null && activeCompany?.stripe_id !== null){
      connectStripe = 'complete';
    }
  
    if(activeCompany?.stripe_account_data !== null && activeCompany?.stripe_id !== null && activeCompany?.company_currency !== null){
      chooseCurrency = 'complete';
    }
  
    if(activeCompany?.stripe_account_data !== null && activeCompany?.stripe_id !== null && activeCompany?.company_currency !== null && userCampaignDetails?.length > 0){
      createCampaign = 'complete';
    }

    if(activeCompany?.domain_verified === true){
      companyVerified = 'complete';
    }
  }
  
  let steps = [
    { name: !activeCompany ? 'Add Company' : 'Edit company', href: !activeCompany ? '/dashboard/add-company' : `/dashboard/${activeCompany?.company_id}/settings`, status: editCompany},
    { name: 'Connect Stripe', href: !companyId ? '/dashboard' : `/dashboard/${companyId}/setup/stripe`, status: connectStripe },
    { name: 'Choose a currency', href: !companyId ? '/dashboard' : `/dashboard/${companyId}/setup/currency`, status: chooseCurrency },
    { name: 'Create a campaign', href: !companyId ? '/dashboard' : `/dashboard/${companyId}/setup/campaign`, status: createCampaign },
    { name: 'Setup Reflio', href: !companyId ? '/dashboard' : `/dashboard/${companyId}/setup/add`, status: companyVerified },
    { name: 'Verify setup', href: !companyId ? '/dashboard' : `/dashboard/${companyId}/setup/verify`, status: companyVerified },
  ]

  return(
    <>
      {
        activeCompany ?
          <nav aria-label="Progress">
            <ol role="list" className="space-y-4 md:flex md:space-y-0 md:space-x-8">
              {steps.map((step) => (
                <li key={step.name} className="md:flex-1">
                  {step.status === 'complete' ? (
                    <a
                      href={step.href}
                      className="group pl-4 py-2 flex flex-col border-l-4 border-green-500 hover:border-green-600 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-[12px]"
                    >
                      <span className="text-xs font-semibold tracking-wide uppercase">
                        {step.id}
                      </span>
                      <span className="text-sm font-medium">{step.name}</span>
                    </a>
                  ) : step.href === router?.asPath ? (
                    <a
                      href={step.href}
                      className="pl-4 py-2 flex flex-col border-l-4 border-primary md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-[12px]"
                      aria-current="step"
                    >
                      <span className="text-xs font-semibold tracking-wide uppercase">{step.id}</span>
                      <span className="text-sm font-medium">{step.name}</span>
                    </a>
                  ) : (
                    <a
                      href={step.href}
                      className="group pl-4 py-2 flex flex-col border-l-4 border-gray-300 hover:border-gray-400 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-[12px]"
                    >
                      <span className="text-xs text-gray-500 font-semibold tracking-wide uppercase group-hover:text-gray-700">
                        {step.id}
                      </span>
                      <span className="text-sm font-medium">{step.name}</span>
                    </a>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        :
          <div className="py-4">
            <LoadingDots/>
          </div>
      }  
    </>
  )
};

export default SetupProgress;