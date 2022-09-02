/* eslint-disable react-hooks/exhaustive-deps */
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import "@/dist/styles.css";
import Layout from '../templates/Layout';
import { useRouter } from 'next/router';

export default function MyApp({ Component, pageProps }) {
  const UserContextProvider = dynamic(() =>
    import("@/utils/useUser").then((module) => module.UserContextProvider)
  );
  const UserAffiliateContextProvider = dynamic(() =>
    import("@/utils/UserAffiliateContext").then((module) => module.UserAffiliateContextProvider)
  );
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