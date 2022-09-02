import Auth from '@/templates/Auth'; 
import SEOMeta from '@/templates/SEOMeta';

export default function Index() {
  return (
    <>
      <SEOMeta title="Sign In"/>
      <Auth type="signin"/>
    </>
  );
};