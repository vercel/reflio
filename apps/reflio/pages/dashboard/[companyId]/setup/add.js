import { useRouter } from 'next/router';
import SetupProgress from '@/components/SetupProgress'; 
import { CopyBlock, monokaiSublime } from "react-code-blocks";
import Button from '@/components/Button'; 
import Card from '@/components/Card'; 
import { SEOMeta } from '@/templates/SEOMeta'; 

export default function TrackingSetupPage() {
  const router = useRouter();

  const embedCode = 
  `<script async src='https://reflio.com/js/reflio.min.js' data-reflio='${router?.query?.companyId}'></script>`;

  const scriptCode = 
  `<script type="text/javascript">
    await Reflio.signup('yourcustomer@email.com')
</script>`
  
  return (
    <>
      <SEOMeta title="Setup Reflio"/>
      <div className="py-12 border-b-4 border-gray-300">
        <div className="wrapper">
          <SetupProgress/>
        </div>
      </div>
      <div className="pt-12 mb-6">
        <div className="wrapper">
          <h1 className="text-2xl sm:text-3xl tracking-tight font-extrabold">Add Reflio to your site</h1>
        </div>
      </div>
      <div className="wrapper">
        <div className="grid grid-cols-1 space-y-3 md:grid-cols-12 md:space-y-0 md:space-x-4">
          <Card className="lg:col-span-6 xl:col-span-8 max-w-4xl">
            <h2 className="text-3xl font-semibold mb-5">Manual setup</h2>
            <div className="mb-5">
              <h3 className="text-xl font-semibold mb-1">Step 1: Installing the snippet on your website</h3>
              <p className="text-lg mb-5">Paste the following JavaScript snippet into your website&apos;s <code className="text-lg tracking-tight font-bold text-pink-500">{`<head>`}</code> tag</p>
              <div className="w-full rounded-xl text-lg overflow-hidden shadow-lg">
                <CopyBlock
                  text={embedCode}
                  language='javascript'
                  showLineNumbers={false}
                  startingLineNumber={1}
                  theme={monokaiSublime}
                  codeBlock
                /> 
              </div>
            </div>
            <div className="mb-5">
              <h3 className="text-xl font-semibold mb-1">Step 2: Tracking the referral</h3>
              <p className="text-lg mb-5">To track a referral on your website, you need to run the below function when you are first creating the user. This process usually happens on your sign up page. <strong>You should do this for every sign up to make sure you catch all valid referrals. It doesn't matter if you send every single sign up to Reflio; our system will only save users who signed up after visiting a referral link, and has a valid cookie in their browser.</strong></p>
              <div className="w-full rounded-xl text-lg overflow-hidden shadow-lg">
                <CopyBlock
                  text={scriptCode}
                  language='javascript'
                  showLineNumbers={false}
                  theme={monokaiSublime}
                  codeBlock
                /> 
              </div>
            </div>
            <div>
              <p className="text-lg mb-8">Reflio will automatically add the referral ID to an existing Stripe customer with the same email address, or later if the Stripe customer is created at a different time. When the user converts to a paying customer, Reflio will automatically create a commission if there was an eligible referral ID associated with that user.</p>
              <Button
                large
                primary
                href={`/dashboard/${router?.query?.companyId}/setup/verify`}
              >
                <span>Verify installation</span>
              </Button>
            </div>
          </Card>
          <Card 
            className="lg:col-span-6 xl:col-span-4"
            secondary
          >
            <span className="text-sm font-semibold uppercase py-1 px-3 bg-white rounded-xl mb-2 inline-block">Free whilst in Beta</span>
            <h2 className="text-3xl font-semibold mb-4 flex items-center text-white">Concierge setup</h2>
            <p className="text-lg mb-5 text-white">We offer a free concierge setup option where we will manually help you add Reflio to your codebase. Please contact us via the button below to get started.</p>
            <Button
              onClick={e=>{$crisp.push(['do', 'chat:open']), $crisp.push(["set", "message:text", ["Hello, I'd like to get help setting up Reflio on my website."]]);}}
              large
              primary
            >
              Live Chat
            </Button>
          </Card>
        </div>
      </div>
    </>
  );
}