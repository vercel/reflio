import { useRouter } from 'next/router';
import { useState } from 'react';
import { useUser } from '@/utils/useUser';
import { useUserAffiliate } from '@/utils/UserAffiliateContext';
import Button from '@/components/Button'; 
import toast from 'react-hot-toast';
import { postData } from '@/utils/helpers';

const AffiliateInvites = (props) => {
  const router = useRouter();
  const { session } = useUser();
  const { userAffiliateInvites } = useUserAffiliate();
  const [loading, setLoading] = useState(false);

  const handleInviteDecision = async (type, affiliateId) => {    
    setLoading(true);

    try {
      const { status } = await postData({
        url: '/api/affiliate/handle-invite',
        data: { 
          handleType: type,
          affiliateId: affiliateId
        },
        token: session.access_token
      });

      if(status === "success"){
        setLoading(false);
        router.replace(window.location.href);
        toast.success(type === "accept" ? 'Congratulations! The invitation was accepted.' : 'The invitation was declined.')
      }
  
    } catch (error) {
      setLoading(false);
      toast.error(type === "accept" ? 'The invitation could not be accepted. Please try again later.' : 'The invitation could not be declined. Please try again later.')
    }
  };

  return(
    <div className="wrapper">
      <div className="mb-5">
        <h2 className="text-2xl sm:text-3xl tracking-tight font-extrabold">Campaign Invites</h2>
      </div> 
      <div>
        {
          userAffiliateInvites !== null && userAffiliateInvites?.length > 0 ?
            <div className="space-y-4">
              {userAffiliateInvites?.map(invite => {
                return(
                  <div className="rounded-lg bg-secondary p-6">
                    <div className="flex">
                      <div className="xl:ml-3 flex-1 xl:flex xl:justify-between xl:items-center">
                        <p className="mb-3 xl:mb-0 text-md text-white font-semibold">You have been invited to join campaign <span className="font-bold underline">{invite?.campaign_name}</span> by <span className="font-bold underline">{invite?.company_name}</span></p>
                        <div className="xl:flex xl:flex-col xl:items-center xl:justify-center">
                          <Button
                            onClick={e=>{handleInviteDecision('accept', invite?.affiliate_id)}}
                            large
                            primary
                            disabled={loading}
                          >
                            <span>Accept invite</span>
                          </Button>
                          <button disabled={loading} onClick={e=>{handleInviteDecision('decline', invite?.affiliate_id)}} className="ml-3 xl:ml-0 xl:mt-2 text-white font-semibold underline text-xs xl:text-sm">Decline invite</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          :
            <div>
              <p>You have no new invites.</p>
            </div>
        }
      </div>
    </div>
  );
}

export default AffiliateInvites;