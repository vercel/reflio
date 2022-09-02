import Auth from '@/templates/Auth'; 
import SEOMeta from '@/templates/SEOMeta';

export default function SignUp() {
  return (
    <>
      <SEOMeta title="Sign Up"/>
      <Auth type="signup"/>
    </>
  );
}