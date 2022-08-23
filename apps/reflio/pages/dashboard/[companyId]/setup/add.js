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
    await Reflio.convert('yourcustomer@email.com')
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
        <div className="grid grid-cols-1 space-y-3 md:grid-cols-2 md:space-y-0 md:space-x-3">
          <Card>
            <h2 className="text-3xl font-semibold mb-5">Manual setup</h2>
            <div className="mb-5">
              <h3 className="text-xl font-semibold">Step 1: Installing the snippet on your website</h3>
              <p className="text-lg mb-2">Paste the following JavaScript snippet into your website&apos;s <code className="text-lg tracking-tight font-bold text-pink-500">{`<head>`}</code> tag</p>
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
            <div className="mb-10">
              <h3 className="text-xl font-semibold">Step 2: Tracking the conversion</h3>
              <p className="text-lg mb-2">To track a referral conversion your website, you need to run the below function when you are creating the Stripe customer. This process usually happens on a thank you page, via the Stripe API in your backend or some other callback that occurs after the Stripe checkout has been completed.</p>
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