import Head from 'next/head';

function SEOMeta({ title, description, keywords, img }) {
  let setTitle = title ?? "Reflio: Create a privacy-friendly referral program for your SaaS.";
  let setDescription = description ?? "Create a privacy-friendly referral program for your SaaS. GDPR Friendly. Based in the UK. European-owned infrastructure.";
  let setKeywords = keywords ?? "Reflio, Referral software, create referral program, stripe referral program";
  let setImg = img ?? "/og.png";

  setTitle = setTitle + " | Reflio Affiliates";

  return (
    <Head>
      <meta key="utfType" charSet="utf-8" />
      <meta key="httpEquiv" httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta key="description" name="description" content={setDescription} />
      <meta key="keywords" name="keywords" content={setKeywords} />

      {/* Twitter */}
      <meta key="twCard" name="twitter:card" content="summary_large_image"/>
      <meta key="twCreator" name="twitter:creator" content="@useReflio" />
      <meta key="twImage" name="twitter:image" content={`${process.env.NEXT_PUBLIC_AFFILIATE_SITE_URL}${setImg}`}/>

      {/* Open Graph */}
      <meta key="ogURL" property="og:url" content={`${process.env.NEXT_PUBLIC_AFFILIATE_SITE_URL}`} />
      <meta key="ogImage" property="og:image" content={`${process.env.NEXT_PUBLIC_AFFILIATE_SITE_URL}${setImg}`} />
      <meta key="ogSiteName" property="og:site_name" content="Reflio" />
      <meta key="ogTitle" property="og:title" content={setTitle} />
      <meta key="ogDescription" property="og:description" content={setDescription} />
      <meta key="themeColor" name="theme-color" content="#ffaf45" />
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
    </Head>
  )
}

export default SEOMeta;