import Auth from '@/templates/Auth'; 
import SEOMeta from '@/templates/SEOMeta';

export default function SignIn() {
  return (
    <>
      <SEOMeta title="Sign In"/>
      <Auth type="signin"/>
    </>
  );
}