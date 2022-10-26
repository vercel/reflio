import { useRouter } from 'next/router';
import { useState } from 'react';
import { useUser, newCompany } from '@/utils/useUser';
import { SEOMeta } from '@/templates/SEOMeta'; 
import Button from '@/components/Button'; 
import { checkValidUrl, slugifyString } from '@/utils/helpers';
import toast from 'react-hot-toast';

export default function AddCompany() {
  const router = useRouter();
  const { userDetails } = useUser();
  const [errorMessage, setErrorMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [websiteUrlInput, setWebsiteUrlInput] = useState(null);
  const [companyHandleInput, setCompanyHandleInput] = useState(null);
  const [urlValid, setUrlValid] = useState(null);

  const handleSubmit = async (e) => {

    e.preventDefault();

    if(loading === true){
      return false;
    }
    
    if(checkValidUrl(websiteUrlInput) === false){
      setUrlValid(false);
      return false;
    }
    
    if(checkValidUrl(websiteUrlInput) === true){
      setUrlValid(true);
    }
    
    const formData = new FormData(e.target);
    const data = {};
 
    for (let entry of formData.entries()) {
      data[entry[0]] = entry[1];
    }

    setLoading(true);

    await newCompany(userDetails, data).then((result) => {
      if(result[0]?.company_id){
        router.push(`/dashboard/${result[0]?.company_id}`)
      } else {
        if(result === "duplicate"){
          toast.error('This handle already exists. Please try another.');
        } else {
          toast.error('There was an error when creating your company. Please try again later, or contact support.');
        }
      }

      setLoading(false);
    });

  };

  // if(planDetails === 'free' && userCompanyDetails?.length >= 1){
  //   router.replace('/dashboard/plan');
  // }

  return (
    <>
      <SEOMeta title="Add Company"/>
      
      <div className="wrapper">
        <div>
          <form className="rounded-xl bg-white max-w-2xl overflow-hidden shadow-lg border-4 border-gray-300 mx-auto" action="#" method="POST" onSubmit={handleSubmit}>
            <div className="py-6 text-center border-b-4">
              <h1 className="text-2xl sm:text-3xl tracking-tight font-extrabold">Add company</h1>
            </div>
            <div className="p-6">
              <div className="space-y-8 divide-y divide-gray-200">
                <div>
                  <div>
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="col-span-12">
                        <label htmlFor="company_name" className="text-lg leading-6 font-medium text-gray-900 mb-2">
                          Company Name
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <input
                            minLength="3"
                            maxLength="25"
                            required
                            placeholder="e.g. Google"
                            type="text"
                            name="company_name"
                            id="company_name"
                            autoComplete="company_name"
                            className="flex-1 block w-full min-w-0 p-3 rounded-xl focus:outline-none sm:text-md border-2 border-gray-300"
                          />
                        </div>
                      </div>

                      <div className="col-span-12">
                        <label htmlFor="company_url" className="text-lg leading-6 font-medium text-gray-900 mb-2">Company Website</label>
                        <div>
                          <div className="mt-1 flex items-center h-14 mb-3">
                            <div className="h-full bg-gray-100 flex items-center justify-center p-3 rounded-lg rounded-tr-none rounded-br-none border-2 border-r-0 border-gray-300">
                              <span>https://</span>
                            </div>
                            <input
                              minLength="3"
                              maxLength="25"
                              required
                              placeholder="google.com"
                              type="text"
                              name="company_url"
                              id="company_url"
                              autoComplete="company_url"
                              className="flex-1 block w-full min-w-0 h-full focus:outline-none sm:text-md rounded-lg rounded-tl-none rounded-bl-none border-2 border-l-0 border-gray-300"
                              onChange={e=>{setWebsiteUrlInput(e.target.value), console.log(checkValidUrl(e.target.value))}}
                            />
                          </div>
                          <p className="text-gray-500">Please only include the base domain of your website (e.g. google.com). You do not need to include https:// or www. We will automatically do this on our end.</p>
                        </div>
                      </div>

                      <div className="col-span-12">
                        <label htmlFor="company_handle" className="text-lg leading-6 font-medium text-gray-900 mb-2">Company Handle</label>
                        <div>
                          <div className="mt-1 flex items-center h-14 mb-3">
                            <div className="h-full bg-gray-100 flex items-center justify-center p-3 rounded-lg rounded-tr-none rounded-br-none border-2 border-r-0 border-gray-300">
                            <span>{process.env.NEXT_PUBLIC_AFFILIATE_SITE_URL}/</span>
                            </div>
                            <input
                              minLength="3"
                              maxLength="25"
                              required
                              value={companyHandleInput}
                              placeholder="google"
                              type="text"
                              name="company_handle"
                              id="company_handle"
                              autoComplete="company_handle"
                              className="flex-1 block w-full min-w-0 h-full focus:outline-none sm:text-md rounded-lg rounded-tl-none rounded-bl-none border-2 border-l-0 border-gray-300"
                              onChange={e=>{setCompanyHandleInput(slugifyString(e.target.value))}}
                            />
                          </div>
                          <p className="text-gray-500">Your company handle is used for shareable links, including the link that affiliates see to join your campaign.</p>
                        </div>
                      </div>

                      {
                        !urlValid && urlValid !== null &&
                        <div className="border-t-4 pt-6 bg-white text-center col-span-12">
                          <div className="bg-red-600 text-center p-4 rounded-lg">
                            <p className="text-white text-sm font-semibold">The URL you entered is not valid. Please check it and try again.</p>
                          </div>
                        </div>
                      }

                      {/* <div className="sm:col-span-12">
                        <label htmlFor="loom_email" className="block text-sm font-medium text-gray-700">
                          Loom Email Address
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <input
                            required
                            placeholder="youremail@example.com"
                            type="text"
                            name="loom_email"
                            id="loom_email"
                            autoComplete="loom_email"
                            className="flex-1 block w-full min-w-0 rounded-md focus:outline-none sm:text-sm border-gray-300"
                          />
                        </div>
                      </div> */}

                    </div>
                  </div>

                  {
                    errorMessage &&
                    <div className="bg-red text-center p-4 mt-8 rounded-lg">
                      <p className="text-white text-sm font-medium">There was an error when creating your company, please try again later.</p>
                    </div>
                  }
                </div>
              </div>
            </div>
            <div className="border-t-4 p-6 bg-white flex items-center justify-start">
              <Button
                large
                secondary
                disabled={websiteUrlInput === null && !urlValid && loading}
              >
                <span>{loading ? 'Adding Company...' : 'Add Company'}</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}