import { useRouter } from 'next/router';
import SetupProgress from '@/components/SetupProgress'; 
import { CopyBlock, monokaiSublime } from "react-code-blocks";
import Button from '@/components/Button'; 
import { SEOMeta } from '@/templates/SEOMeta'; 

export default function TrackingSetupPage() {
  const router = useRouter();

  const embedCode = 
  `<script async src='https://reflio.com/js/reflio.min.js' data-reflio='${router?.query?.companyId}'></script>`;
  
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
        <div className="rounded-xl bg-white overflow-hidden shadow-lg border-4 border-gray-300 p-6">
          <div className="mb-5">
            <h2 className="text-xl font-semibold">Step 1: Installing the snippet on your website</h2>
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
            <h2 className="text-xl font-semibold">Step 2: Tracking the conversion</h2>
            <p className="text-lg mb-2">To track a referral conversion your website, you need to run the <code className="text-lg tracking-tight font-bold text-pink-500">{`reflio('convert)`}</code> function when you are creating the Stripe customer. This process usually happens on a thank you page, via the Stripe API in your backend or some other callback that occurs after the Stripe checkout has been completed.</p>
            <div className="w-full rounded-xl text-lg overflow-hidden shadow-lg">
              <CopyBlock
                text={`await Reflio.convert('yourcustomer@email.com')`}
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
        </div>
      </div>
    </>
  );
}