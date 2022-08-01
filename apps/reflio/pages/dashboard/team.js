import SEOMeta from '@/templates/SEOMeta'; 
import LoadingDots from '@/components/LoadingDots';

export default function TeamPage() {
  return (
    <>
      <SEOMeta title="Team"/>
      <div className="pb-10 mb-12 border-b-4">
        <div className="pt-10 wrapper">
          <h1 className="text-2xl sm:text-3xl tracking-tight font-extrabold">Team</h1>
        </div>
      </div>
      <div className="wrapper">
        <div
          className="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-12 text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 max-w-2xl"
        >
          <div className="flex justify-center mb-3">
            <LoadingDots/>
          </div>
          <span className="mt-2 block text-sm font-medium text-gray-600">Team features are coming soon.</span>
        </div>
      </div>
    </>
  );
}