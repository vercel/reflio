import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useUser } from '@/utils/useUser';
import SEOMeta from '@/templates/SEOMeta'; 
import Button from '@/components/Button'; 
import { useUserAffiliate } from '@/utils/UserAffiliateContext';
import { postData } from 'utils/helpers';
import LoadingTile from '@/components/LoadingTile';
import { DocumentTextIcon, ArrowNarrowLeftIcon } from '@heroicons/react/outline';
import { urlImgChecker } from '@/utils/helpers';

const AffiliateCodePage = () => {
  const router = useRouter();
  const { user, session } = useUser();
  const { userAffiliateDetails } = useUserAffiliate();
  const [assets, setAssets] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  let affiliateFiltered = null as any;

  if(affiliateFiltered === null && userAffiliateDetails !== null && userAffiliateDetails?.length > 0){
    if(userAffiliateDetails?.filter((campaign: { affiliate_id: string | string[] | undefined; })=>campaign?.affiliate_id === router.query.affiliateId)?.length){
      affiliateFiltered = userAffiliateDetails?.filter((campaign: { affiliate_id: string | string[] | undefined; })=>campaign?.affiliate_id === router.query.affiliateId)[0];
    } else {
      router.replace('/dashboard/campaigns')
    }
  }

  const getData = async () => {
    try {      
      setLoading(true);

      console.log('running!')

      const { assets } = await postData({
        url: '/api/affiliate/company-assets',
        data: {
          company_id: affiliateFiltered?.company_id,
          affiliate_id: affiliateFiltered?.affiliate_id
        },
        token: session.access_token
      });

      console.log('assets:')
      console.log(assets)

      if(assets){
        setAssets(assets);
      }
    } catch (error) {
      console.log('Error:')
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(loading === false && affiliateFiltered?.company_id){
      getData();
    }
  }, [session, affiliateFiltered]);

  return (
    <>
      <SEOMeta title="Company Assets"/>
      <div className="pb-10 mb-12 border-b-4">
        <div className="pt-10 wrapper sm:flex sm:items-center sm:justify-between">
          <h1 className="text-2xl sm:text-3xl tracking-tight font-extrabold">{affiliateFiltered?.company_name} Assets</h1>
          <div>
            <Button
              className="mt-3 sm:mt-0"
              href={`/dashboard/campaigns`}
              medium
              mobileFull
              secondary
            >
              <ArrowNarrowLeftIcon className="mr-2 w-6 h-auto"/>
              <span>Back to dashboard</span>
            </Button>
          </div>
        </div>
      </div>
      <div className="wrapper">
        <div>
          {
            assets?.length > 0 ?
              <div className="mt-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {
                    assets.map((asset: any) => (
                      <div key={asset?.asset_id} className="border-4 border-gray-200 rounded-xl p-8 pb-20 relative">
                        <p className="text-sm mb-4">{asset?.file_custom_name}</p>
                        {
                          urlImgChecker(asset?.signed_url) === true ?
                            <a href={asset?.signed_url} target="_blank" rel="noreferrer">                        
                              <img 
                                src={asset?.signed_url} 
                                alt={asset?.file_custom_name}
                                className="w-full h-auto max-h-[200px] object-contain"
                              />
                            </a>
                          :
                            <div className="min-h-[200px] p-3 rounded-xl bg-gray-200 border-4 border-gray-300 flex items-center justify-center">
                              <DocumentTextIcon className="w-20 h-auto text-gray-400"/>
                            </div>
                        }
                        <Button
                          className="w-full mt-6"
                          href={asset?.signed_url}
                          medium
                          primary
                          download
                        >
                          Download
                        </Button>
                      </div>
                    ))
                  }
                </div>
                <div className="mt-8">
                  <p className="text-sm text-gray-500">{assets?.length} {assets?.length === 1 ? 'asset' : 'assets'} uploaded</p>
                </div>  
              </div>
            : 
              loading === true ?
                <div>
                  <LoadingTile/>
                </div>
              :
                <div className="mt-8">
                  <p className="text-gray-500 mb-4">No assets found for this company.</p>
                  <Button
                    href={`/dashboard/campaigns`}
                    small
                    secondary
                  >
                    <ArrowNarrowLeftIcon className="mr-2 w-6 h-auto"/>
                    <span>Back to dashboard</span>
                  </Button>
                </div>  
          }
        </div>
      </div>
    </>
  );
};

export default AffiliateCodePage;