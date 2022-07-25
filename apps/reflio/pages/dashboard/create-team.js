import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useUser, newTeam } from 'utils/useUser';
import { SEOMeta } from '@/templates/SEOMeta'; 
import Button from '@/components/Button'; 
import toast from 'react-hot-toast';

export default function CreateTeam() {
  const router = useRouter();
  const { user, userFinderLoaded } = useUser();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    if(loading === true){
      return false;
    }

    const formData = new FormData(e.target);
    const data = {};
 
    for (let entry of formData.entries()) {
      data[entry[0]] = entry[1];
    }

    setLoading(true);

    await newTeam(user, data).then((result) => {
      if(result === "success"){
        router.push('/dashboard/add-company');

      } else {
        toast.error('There was an error when creating your team. Please try again later, or contact support.');
      }

      setLoading(false);
    });

  };

  // if(planDetails === 'free' && userCompanyDetails?.length >= 1){
  //   router.replace('/dashboard/plan');
  // }

  return (
    <>
      <SEOMeta title="Create Team"/>
      
      <div className="pt-12 wrapper">
        <div>
          <form className="rounded-xl bg-white max-w-2xl overflow-hidden shadow-lg border-4 border-gray-300 mx-auto" action="#" method="POST" onSubmit={handleSubmit}>
            <div className="py-6 text-center border-b-4">
              <h1 className="text-2xl sm:text-3xl tracking-tight font-extrabold mb-2">Create a team</h1>
              <p>Firstly, please create a team to get started. You can invite members to it later.</p>
            </div>
            <div className="p-6">
              <div className="space-y-8 divide-y divide-gray-200">
                <div>
                  <div>
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-12">
                        <label htmlFor="team_name" className="text-lg leading-6 font-medium text-gray-900 mb-2">
                          Team Name
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <input
                            minLength="3"
                            maxLength="25"
                            required
                            placeholder="e.g. Google"
                            type="text"
                            name="team_name"
                            id="team_name"
                            autoComplete="team_name"
                            className="flex-1 block w-full min-w-0 p-3 rounded-xl focus:outline-none sm:text-md border-2 border-gray-300"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t-4 p-6 bg-white flex items-center justify-start">
              <Button
                large
                secondary
                disabled={loading}
              >
                <span>{loading ? 'Creating Team...' : 'Create Team'}</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}