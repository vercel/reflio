import Head from 'next/head';

function SEOMeta({ title, description, keywords, img }) {

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
      <meta name="twitter:creator" content="@useReflio" key="twhandle" />
      <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_AFFILIATE_SITE_URL}${setImg}`}/>

      {/* Open Graph */}
      <meta property="og:url" content={`${process.env.NEXT_PUBLIC_AFFILIATE_SITE_URL}`} key="ogurl" />
      <meta property="og:image" content={`${process.env.NEXT_PUBLIC_AFFILIATE_SITE_URL}${setImg}`} key="ogimage" />
      <meta property="og:site_name" content="Reflio" key="ogsitename" />
      <meta property="og:title" content={setTitle} key="ogtitle" />
      <meta property="og:description" content={setDescription} key="ogdesc" />
      <title>{setTitle}</title>
      <link rel="manifest" href="/site.webmanifest"/>
      <link
        href="/favicon-16x16.png"
        rel="icon"
        type="image/png"
        sizes="16x16"
        purpose="any maskable"
      />
      <link
        href="/favicon-32x32.png"
        rel="icon"
        type="image/png"
        sizes="32x32"
        purpose="any maskable"
      />
      <link rel="icon" href="/favicon.ico" type="image/x-icon"/>
      <link rel="apple-touch-icon" href="/apple-touch-icon.png"></link>
      <meta name="theme-color" content="#ffaf45" />
      <script defer data-domain="affiliates.reflio.com" src="https://plausible.io/js/plausible.js"></script>
    </Head>
  )
}

export default SEOMeta;