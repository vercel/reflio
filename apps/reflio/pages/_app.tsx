import type { AppProps } from "next/app";
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useEffect } from 'react';
import "@/dist/styles.css";
import Layout from '@/templates/Layout';
import { useRouter } from 'next/router';
import SEOMeta from '@/templates/SEOMeta'; 

export default function MyApp({ Component, pageProps: { ...pageProps }, }: AppProps<{}>) {
  const UserContextProvider = dynamic(() =>
    import("@/utils/useUser").then((module) => module.UserContextProvider)
  );
  const CompanyContextProvider = dynamic(() =>
    import("@/utils/CompanyContext").then((module) => module.CompanyContextProvider)
  );
  const CampaignContextProvider = dynamic(() =>
    import("@/utils/CampaignContext").then((module) => module.CampaignContextProvider)
  );
  const AffiliateContextProvider = dynamic(() =>
    import("@/utils/AffiliateContext").then((module) => module.AffiliateContextProvider)
  );
  const router = useRouter();
  
  useEffect(() => {
    document.body.classList?.remove('loading');

    if(router?.asPath?.indexOf("&token_type=bearer&type=recovery") > 0) {
      let access_token = router?.asPath?.split("access_token=")[1].split("&")[0];
      router.push('/reset-password?passwordReset=true&access_token='+access_token+'');
    }
  });

  return (
    <>
      {
        typeof window !== "undefined" && window.location.href.includes('/dashboard/') &&
          <Head>
            <script
              dangerouslySetInnerHTML={{
                __html: `!function(w,d,i,s){function l(){if(!d.getElementById(i)){var f=d.getElementsByTagName(s)[0],e=d.createElement(s);e.type="text/javascript",e.async=!0,e.src="https://canny.io/sdk.js",f.parentNode.insertBefore(e,f)}}if("function"!=typeof w.Canny){var c=function(){c.q.push(arguments)};c.q=[],w.Canny=c,"complete"===d.readyState?l():w.attachEvent?w.attachEvent("onload",l):w.addEventListener("load",l,!1)}}(window,document,"canny-jssdk","script");`
              }}
            />
          </Head>
      }
      <SEOMeta/>
      <div>
        {
          router.pathname.indexOf('/dashboard') > -1 ?
            <UserContextProvider>
              <CompanyContextProvider>
                <CampaignContextProvider>
                  <AffiliateContextProvider>
                    <Layout>
                      <Component {...pageProps} />
                    </Layout>
                  </AffiliateContextProvider>
                </CampaignContextProvider>
              </CompanyContextProvider>
            </UserContextProvider>
          :
            <UserContextProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </UserContextProvider>
        }
      </div>
    </>
  );
};