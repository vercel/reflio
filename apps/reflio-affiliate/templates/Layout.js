/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useUser } from '@/utils/useUser';

function Layout({ children }) {
  const { user, userFinderLoaded } = useUser();
  const Toaster = dynamic(() =>
    import("react-hot-toast").then((module) => module.Toaster)
  );
  const AdminMobileNav = dynamic(() => import('@/templates/AdminNavbar/AdminMobileNav'));
  const AdminDesktopNav = dynamic(() => import('@/templates/AdminNavbar/AdminDesktopNav'));
  const router = useRouter();

  let defaultPage = true;
  let dashboardPage = false;
  let simplePage = false;
  
  if(router.pathname.indexOf('/dashboard') === -1 && router.pathname.indexOf('/dashboard/add-company') === -1 && router.pathname.indexOf('/dashboard/create-team') === -1){
    defaultPage = true;
    dashboardPage = false;
    simplePage = false;
  }
  
  if(router.pathname === '/dashboard/add-company' || router.pathname === '/dashboard/create-team' || router.pathname.includes('/invite/')){
    defaultPage = false;
    dashboardPage = false;
    simplePage = true;
  }
  
  if(router.pathname.indexOf('/dashboard') > -1 && simplePage !== true){
    defaultPage = false;
    dashboardPage = true;
    simplePage = false;
  }

  if(dashboardPage === true){
    useEffect(() => {
      if(userFinderLoaded){
        if (!user) router.replace('/signin');
      }
    }, [userFinderLoaded, user]);
  }

  if(!router?.asPath.includes('/invite/')){
    if (typeof window !== "undefined") {
      if(localStorage.getItem('join_campaign_details')){
        if(user){          
          let details = localStorage.getItem('join_campaign_details');
  
          try {
            details = JSON.parse(details);
          } catch (error) {
            console.warn(error);
          }
  
          if(details){
            router.replace(`/invite/${details?.campaign_handle}/${details?.campaign_id}?campaignRedirect=true`)
          }
        }
      }
    }
  }

  return (
    <>
      <Toaster
        position="bottom-center"
        reverseOrder={true}
        gutter={20}
        toastOptions={{
          className: '',
          duration: 5000,
          style: {
            background: '#fff',
            color: '#111827',
          },
          // Default options for specific types
          success: {
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
          error: {
            style: {
              background: '#DC2626',
              color: 'white',
            },
          },
        }}
      />
      {
        defaultPage === true ?
          <main id="skip">{children}</main>
        : simplePage === true ?
          <main id="skip">{children}</main>
        : dashboardPage === true ?
          <div className="h-screen flex overflow-hidden">
            <AdminDesktopNav/>
            <div className="flex-1 overflow-auto focus:outline-none">
              <AdminMobileNav/>
              <main className="flex-1 relative pb-8 z-0 overflow-y-auto">
                <>
                  {children}
                </>
              </main>
            </div>
          </div>
        : <main id="skip">{children}</main>
      }
    </>
  );
};

export default Layout;