import { SEOMeta } from '@/templates/SEOMeta'; 

export const Changelog = () => {
  return(
    <>
      <SEOMeta title="Privacy Policy"/>
      <div className="content-block">
          <div className="max-w-4xl mx-auto px-6">
            <div className="pb-5 border-b-4 border-dashed border-gray-100 text-center">
              <h1>Changelog</h1>
              <p>Your source for recent updates to Reflio</p>
            </div>
            <div className="pt-5">
              <ul className="space-y-6">
                <li>No updates yet.</li>
              </ul>
            </div>
          </div>
      </div>
    </>
  );

}

export default Changelog;