import Head from 'next/head';
import { useRouter } from 'next/router';

export const SEOMeta = ({ title, description, keywords, img }) => {
  const router = useRouter();

  let setTitle = "Reflio: Create a privacy-friendly referral program for your SaaS.";
  let setDescription = "Create a privacy-friendly referral program for your SaaS. GDPR Friendly. Based in the UK. European-owned infrastructure.";
  let setKeywords = "Reflio, Referral software, create referral program, stripe referral program";
  let setImg = "/og.png";

  if(title){
    setTitle = title;
  }

  if(description){
    setDescription = description;
  }

  if(keywords){
    setKeywords = keywords;
  }

  if(img){
    setImg = img;
  }

  setTitle = setTitle + " | Reflio Affiliates";

  return (
    <Head>
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="description" content={setDescription} />
      <meta name="keywords" content={setKeywords} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" key="twcard" />
      <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_AFFILIATE_SITE_URL}${setImg}`}/>

      {/* Open Graph */}
      <meta property="og:url" content={`${process.env.NEXT_PUBLIC_AFFILIATE_SITE_URL}`} key="ogurl" />
      <meta property="og:image" content={setImg} key="ogimage" />
      <meta property="og:site_name" content="Reflio" key="ogsitename" />
      <meta property="og:title" content={setTitle} key="ogtitle" />
      <meta property="og:description" content={setDescription} key="ogdesc" />
      <title>{setTitle}</title>
    </Head>
  )
};

export default SEOMeta;