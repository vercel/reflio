/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/router';
import { useState, useRef } from 'react';
import { useUser, deleteCompany, disableEmails, editCompanyWebsite, uploadLogoImage, editCompanyHandle } from '@/utils/useUser';
import { useCompany } from '@/utils/CompanyContext';
import { SEOMeta } from '@/templates/SEOMeta'; 
import { Switch } from '@headlessui/react';
import { classNames, checkValidUrl, slugifyString } from '@/utils/helpers';
import Button from '@/components/Button'; 
import Card from '@/components/Card'; 
import CompanyLogoUpload from '@/components/CompanyLogoUpload'; 
import toast from 'react-hot-toast';

export default function CompanySettingsPage() {
  const router = useRouter();
  const { activeCompany } = useCompany();
  const [urlLoading, setUrlLoading] = useState(false);
  const [handleLoading, setHandleLoading] = useState(false);
  const [websiteUrlInput, setWebsiteUrlInput] = useState(null);
  const [companyHandleInput, setCompanyHandleInput] = useState(null);
  const [urlValid, setUrlValid] = useState(null);
  const [logoError, setLogoError] = useState(false);
  const fileInput = useRef(null);
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this company?')){
      await deleteCompany(router?.query?.companyId).then((result) => {
        if(result === "success"){
          window.location.href = "/dashboard";
        } else {
          toast.error('There was an error saving your changes.');
        }
      });
    }
  };

  const handleFileUpload = async (e) => {
    if(e.target.files[0].name?.includes("png") && e.target.files[0].size < 2000000){
      await uploadLogoImage(router?.query?.companyId, e.target.files[0]).then((result) => {
        if(result !== "error"){
          setLogoError(false);
          router.replace(window.location.href);
        } else {
          toast.error('There was an error when uploading your image. Please make sure that it is a PNG file and is less than 2mb.');
        }
      });
    } else {
      setLogoError(true);
      return false;
    }
  };

  const handleDisableEmails = async (type) => {    
    await disableEmails(router?.query?.companyId, type).then((result) => {
      if(result === "success"){
        window.location.href = window.location.href;
      } else {
        toast.error('Unable to change email notification status. Please try again later.');
      }
    });
  };

  const handleWebsiteUpdate = async (e) => {

    e.preventDefault();

    if(urlLoading === true){
      return false;
    }

    const formData = new FormData(e.target);
    const data = {};
 
    for (let entry of formData.entries()) {
      data[entry[0]] = entry[1];
    }

    setUrlLoading(true);

    await editCompanyWebsite(router?.query?.companyId, data).then((result) => {
      if(result === "success"){
        router.replace(window.location.href);

      } else {
        toast.error('There was an error saving your changes.');
      }

      setUrlLoading(false);
    });

  };

  const handleCompanyHandleUpdate = async (e) => {

    e.preventDefault();

    if(handleLoading === true){
      return false;
    }

    const formData = new FormData(e.target);
    const data = {};
 
    for (let entry of formData.entries()) {
      data[entry[0]] = entry[1];
    }

    setHandleLoading(true);

    await editCompanyHandle(router?.query?.companyId, data).then((result) => {
      if(result === "success"){
        router.replace(window.location.href);

      } else {
        if(result === "duplicate"){
          toast.error('This handle already exists. Please try another.');
        } else {
          toast.error('There was an error saving your changes.');
        }
      }

      setHandleLoading(false);
    });

  };
  
  return (
    <>
      <SEOMeta title="Settings"/>
      <div className="pb-10 mb-12 border-b-4">
        <div className="pt-10 wrapper">
          <h1 className="text-2xl sm:text-3xl tracking-tight font-extrabold">Company Settings</h1>
        </div>
      </div>
      <div className="wrapper space-y-6">
        <Card>
          <CompanyLogoUpload/>
        </Card>
        <Card>          
          <form action="#" method="POST" onSubmit={handleWebsiteUpdate}>
            <div>
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
                    defaultValue={activeCompany?.company_url}
                    placeholder="https://mywebsite.com"
                    type="text"
                    name="company_url"
                    id="company_url"
                    autoComplete="company_url"
                    className="flex-1 block w-full min-w-0 h-full focus:outline-none sm:text-md rounded-lg rounded-tl-none rounded-bl-none border-2 border-l-0 border-gray-300"
                    onChange={e=>{setUrlValid(checkValidUrl(e.target.value)), urlValid ? setWebsiteUrlInput(e.target.value) : setWebsiteUrlInput(null)}}
                  />
                </div>
                <p className="text-gray-500">Please only include the base domain of your website (e.g. google.com). You do not need to include https:// or www. We will automatically do this on our end.</p>
              </div>
            </div>
            {
              websiteUrlInput !== null && websiteUrlInput !== activeCompany?.company_url && urlValid &&
              <div className="border-t-4 p-6 bg-white flex items-center justify-start">
                <Button
                  medium
                  primary
                  disabled={urlLoading}
                >
                  <span>{urlLoading ? 'Saving Changes...' : 'Save Changes'}</span>
                </Button>
              </div>
            }
            {
              !urlValid && urlValid !== null &&
              <div className="border-t-4 p-6 bg-white flex items-center justify-start">
                <div className="bg-red-600 text-center p-4 rounded-lg">
                  <p className="text-white text-sm font-medium">The URL you entered is not valid. Please check it and try again.</p>
                </div>
              </div>
            }
          </form>
        </Card>
        <Card>
          <form action="#" method="POST" onSubmit={handleCompanyHandleUpdate}>
            <div>
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
                    value={companyHandleInput !== null ? companyHandleInput : activeCompany?.company_handle && activeCompany?.company_handle}
                    placeholder="companyHandle"
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
              companyHandleInput !== null && companyHandleInput !== activeCompany?.company_handle &&
              <div className="border-t-4 p-6 bg-white flex items-center justify-start">
                <Button
                  medium
                  primary
                  disabled={handleLoading}
                >
                  <span>{handleLoading ? 'Saving Changes...' : 'Save Changes'}</span>
                </Button>
              </div>
            }
            {
              !urlValid && urlValid !== null &&
              <div className="border-t-4 p-6 bg-white flex items-center justify-start">
                <div className="bg-red-600 text-center p-4 rounded-lg">
                  <p className="text-white text-sm font-medium">The URL you entered is not valid. Please check it and try again.</p>
                </div>
              </div>
            }
          </form>
        </Card>
        <Card>
          <h3 className="text-lg leading-6 font-medium text-gray-900">Email notifications</h3>
          <div className="mt-2 max-w-2xl text-gray-500">
            <p>When enabled, you will receive email notifications for this company whenever you receive a new sale via commission or affiliate signup.</p>
          </div>
          <div className="mt-5">
            <Switch
              checked={!activeCompany?.disable_emails}
              onChange={e=>{handleDisableEmails(activeCompany?.disable_emails ? false  : true)}}
              className={classNames(
                !activeCompany?.disable_emails ? 'bg-green-600' : 'bg-red-600',
                'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200'
              )}
            >
              <span className="sr-only">Use setting</span>
              <span
                aria-hidden="true"
                className={classNames(
                  !activeCompany?.disable_emails ? 'translate-x-5' : 'translate-x-0',
                  'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                )}
              />
            </Switch>
          </div>
        </Card>
        <Card>
          <h3 className="text-lg leading-6 font-medium text-gray-900">API Key</h3>
          <div className="mt-2 max-w-2xl text-gray-500">
            <p>This is your API key for accessing <a className="font-bold underline text-gray-900" href="https://reflio.com/resources/api-documentation" target="_blank" rel="noreferrer">Reflio&apos;s API</a>.</p>
          </div>
          <div className="mt-5">
            <div className="flex items-center h-14">
              <input
                value={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}
                placeholder="api_key"
                type="text"
                name="api_key"
                id="api_key"
                autoComplete="api_key"
                className="flex-1 block w-full min-w-0 h-full focus:outline-none sm:text-md rounded-lg border-2 border-gray-300 p-2 px-3"
              />
            </div>
          </div>
        </Card>
        <Card>
          <h3 className="text-lg leading-6 font-medium text-gray-900">Danger zone</h3>
          <div className="mt-2 max-w-2xl text-gray-500">
            <p>Once you delete your company, you will lose all data, including all campaigns and affiliates associated with it.</p>
          </div>
          <div className="mt-5">
            <button
              onClick={e=>{handleDelete()}}
              type="button"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete company
            </button>
          </div>
        </Card>
      </div>
    </>
  );
}