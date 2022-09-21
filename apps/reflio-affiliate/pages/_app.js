/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import "@/dist/styles.css";
import Layout from '../templates/Layout';
import { useRouter } from 'next/router';
import SEOMeta from '@/templates/SEOMeta';
import { UserContextProvider } from '@/utils/useUser';
import { UserAffiliateContextProvider } from '@/utils/UserAffiliateContext';

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  
  useEffect(() => {
    document.body.classList?.remove('loading');

    if(router?.asPath?.indexOf("&token_type=bearer&type=recovery") > 0) {
      let access_token = router?.asPath?.split("access_token=")[1].split("&")[0];
      router.push('/reset-password?passwordReset=true&access_token='+access_token+'');
    }
  }, []);

  return (
    <>
      <SEOMeta/>
      <UserContextProvider>
        <UserAffiliateContextProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </UserAffiliateContextProvider>
      </UserContextProvider>
    </>
  );
}