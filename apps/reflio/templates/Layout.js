/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Navbar } from '@/components/Navbar';
import { useUser } from 'utils/useUser';

export default function Layout({ children }) {
  const { user, userFinderLoaded } = useUser();
  const Toaster = dynamic(() =>
    import("react-hot-toast").then((module) => module.Toaster)
  );
  const Footer = dynamic(() => import('@/components/Footer'));
  const AdminMobileNav = dynamic(() => import('@/components/AdminNavbar/AdminMobileNav'));
  const AdminDesktopNav = dynamic(() => import('@/components/AdminNavbar/AdminDesktopNav'));
  const SimpleNav = dynamic(() => import('@/components/SimpleNav'));
  const StripeDisconnectNotice = dynamic(() => import('@/components/StripeDisconnectNotice'));
  const router = useRouter();
  let defaultPage = true;
  let dashboardPage = false;
  let simplePage = false;
  let campaignCustomizer = false;

  if(router.pathname.indexOf('/dashboard') === -1 && router.pathname.indexOf('/dashboard/add-company') === -1 && router.pathname.indexOf('/dashboard/create-team') === -1){
    dashboardPage = false;
    simplePage = false;
    campaignCustomizer = false;
    defaultPage = true;
  }

  if(router.pathname === '/dashboard/add-company' || router.pathname === '/dashboard/create-team'){
    defaultPage = false;
    dashboardPage = false;
    campaignCustomizer = false;
    simplePage = true;
  }

  if(router.pathname.indexOf('/dashboard') > -1 && simplePage !== true){
    defaultPage = false;
    simplePage = false;
    campaignCustomizer = false;
    dashboardPage = true;
  }
  
  if(router.pathname.indexOf('/dashboard') > -1 && router.pathname.indexOf('/campaigns') > -1 && router.pathname.indexOf('/customize') > -1){
    defaultPage = false;
    dashboardPage = false;
    simplePage = false;
    campaignCustomizer = true;
  }

  if(dashboardPage === true){
    useEffect(() => {
      if(userFinderLoaded){
        if (!user) router.replace('/signin');
      }
    }, [userFinderLoaded, user]);
  }

  return (
    <>
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
          defaultPage === true &&
          <Navbar />
        }
        { 
          simplePage === true &&
          <SimpleNav/>
        }
        {
          defaultPage === true ?
            <main id="skip">{children}</main>
          : simplePage === true ?
            <main id="skip">{children}</main>
          : dashboardPage === true ?
            <div className="h-screen flex overflow-hidden">
              <AdminDesktopNav/>
              <div className="flex-1 overflow-auto focus:outline-none">
                <StripeDisconnectNotice/>
                <AdminMobileNav/>
                <main className="flex-1 relative pb-8 z-0 overflow-y-auto">
                  <>
                    {children}
                  </>
                </main>
              </div>
            </div>
          : campaignCustomizer === true ?
            <div className="h-screen flex overflow-hidden">
              <div className="flex-1 overflow-auto focus:outline-none">
                <main className="flex-1 relative z-0 overflow-y-auto">
                  <>
                    {children}
                  </>
                </main>
              </div>
            </div>
          : <main id="skip">{children}</main>
        }
        {
          defaultPage === true &&
          <Footer />
        }
      </>
    </>
  );
}
