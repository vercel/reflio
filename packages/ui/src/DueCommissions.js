import { useState } from 'react';
import { getSales } from '@/utils/useUser';
import { useCompany } from '@/utils/CompanyContext';
import { checkUTCDateExpired } from '@/utils/helpers';
import { ExclamationIcon } from '@heroicons/react/solid';
import { useRouter } from 'next/router';
import LoadingDots from '@/components/LoadingDots';

export const DueCommissions = (props) => {
  const { activeCompany } = useCompany();
  const [commissions, setCommissions] = useState([]);
  const router = useRouter();

  if(commissions?.length === 0 && activeCompany?.company_id){
    getSales(activeCompany?.company_id, null, "due").then(results => {
      console.log(results);

      if(results !== "error" && results?.data?.length){
        setCommissions(results);
      }

      if(results === "error"){
        console.warn("There was an error when getting data");
      }

      if(results?.data?.length === 0){
        setCommissions({"data": [], "count": 0});
      }
    })
  }

  if(commissions?.data?.filter(commission => commission?.paid_at === null && checkUTCDateExpired(commission?.commission_due_date) === true)?.length > 0){
    return (
      <div className={props?.className && props.className}>
        <a href={`/dashboard/${router?.query?.companyId}/commissions/due`} className="inline-block bg-red-500 hover:bg-red-600 border-l-4 border-red-600 p-4 rounded-xl">
          <div className="flex items-center">
            <ExclamationIcon className="h-6 w-auto text-white" aria-hidden="true" />
            <span className="font-semibold text-base text-white ml-2 mb-1">
              You have {commissions?.data?.filter(commission => commission?.paid_at === null && checkUTCDateExpired(commission?.commission_due_date) === true)?.length} sales with due commissions
            </span>
          </div>
        </a>
      </div>
    );
  } else {
    return false;
  }
};

export default DueCommissions;