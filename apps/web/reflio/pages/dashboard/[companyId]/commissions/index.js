import SEOMeta from '@/components/SEOMeta'; 
import CommissionsTemplate from '@/components/ui/CommissionsTemplate'; 

export default function CommissionsPage() {
  return (
    <>
      <SEOMeta title="Sales"/>
      <div className="mb-8">
        <div className="pt-10 wrapper">
          <h1 className="text-2xl sm:text-3xl tracking-tight font-extrabold mb-3">Sales</h1>
          <p>Payments which came from successfully tracked referrals will show here.</p>
        </div>
      </div>
      <CommissionsTemplate/>
    </>
  );
}