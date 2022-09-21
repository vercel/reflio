export default {
  title: 'Reflio: Create a privacy-friendly referral program for your SaaS.',
  description: 'Create a privacy-friendly referral program for your SaaS. GDPR Friendly. Based in the UK. European-owned infrastructure.',
  keywords: 'Reflio, Referral software, create referral program, stripe referral program',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://www.affiliates.reflio.com',
    site_name: 'Reflio',
  },
  twitter: {
    handle: '@useReflio',
    site: 'https://reflio.com',
    cardType: 'summary_large_image',
  },
  images: [
    {
      url: process.env.NEXT_PUBLIC_AFFILIATE_SITE_URL+'/og.pnf',
      width: 2400,
      height: 1350,
      alt: 'Og Image',
      type: 'image/png',
    }
  ]
};