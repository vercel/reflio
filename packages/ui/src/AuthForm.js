import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState } from 'react';
import { useUser } from '@/utils/useUser';
// import { Twitter } from '@/components/Icons/Twitter';
// import { Google } from '@/components/Icons/Google';
import { Button } from '@/components/Button';

export const AuthForm = ({ type, campaignId, campaignHandle, affiliate }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });
  const router = useRouter();
  const { signIn } = useUser();
  let invitePage = false;

  if(router?.asPath?.includes('/invite/') && !router?.asPath?.includes('/signin')){
    type === 'signup';
  }

  if(router?.asPath?.includes('/invite/')){
    invitePage = true;
  }

  let authState = type === 'signin' ? "Sign in" : type === "signup" ? "Sign up" : "Sign in";

  const handleSignin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage({});

    let funcType = signIn({ email }, {shouldCreateUser: type === "signin" ? false : true, redirectTo: `${affiliate === true ? process.env.NEXT_PUBLIC_AFFILIATE_SITE_URL : process.env.NEXT_PUBLIC_SITE_URL}/dashboard`})

    const { error } = await funcType;
    if(error){
      setMessage({ type: 'error', content: error.message });
    } else {
      setMessage({
        type: 'note',
        content: 'Check your email for the magic link.'
      });

      if(campaignId){
        if (typeof window !== "undefined") {
          localStorage.setItem("join_campaign_details", JSON.stringify({"campaign_id": campaignId, "campaign_handle": campaignHandle}));
        }
      }
    }
    setLoading(false);
  };

  const handleOAuthSignIn = async (provider) => {
    setLoading(true);
    const { error } = await signIn({ provider });
    if (error) {
      setMessage({ type: 'error', content: error.message });
    }
    setLoading(false);
  };

  return(
    <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-12">

        {
          !invitePage &&
          <div>
            <h1 className="text-center text-3xl font-extrabold text-gray-900 capitalize">{authState}</h1>
          </div>
          
        }
        <form onSubmit={handleSignin} className="space-y-4">
          <input type="hidden" name="remember" defaultValue="true" />
          <div>
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none rounded-lg relative block w-full p-4 border-2 border-gray-200 placeholder-gray-500 focus:outline-none focus:z-10 text-base"
              placeholder="Email address"
              onChange={e=>{setEmail(e.target.value)}}
            />
          </div>

          <div>
            <Button
              type="submit"
              medium
              secondary
              className="w-full"
            >
              Send magic link
            </Button>
          </div>

          {
            type === "signin" ?
              <div className="mt-3 text-center text-sm">
                <span className="text-accents-2">Don&apos;t have an account?</span>
                {` `}
                <Link href="/signup">
                  <a className="text-accents-1 font-bold hover:underline cursor-pointer">
                    Sign up.
                  </a>
                </Link>
              </div>
            :
              <div className="mt-3 text-center text-sm">
                <span className="text-accents-2">Already have an account?</span>
                {` `}
                <Link href={'/signin'}>
                  <a className="text-accents-1 font-bold hover:underline cursor-pointer">
                    Sign in.
                  </a>
                </Link>
              </div>
          }
{/* 
          <div className="mb-6 space-y-2">
            <button
              type="button"
              className="flex align-center justify-center h-full min-h-full w-full font-medium rounded-lg m-0 p-3 px-5 border-2 hover:bg-accents-9 bg-white"
              disabled={loading}
              onClick={() => handleOAuthSignIn('twitter')}
            >
              <Twitter />
              <span className="ml-2">{authState} with Twitter</span>
            </button>
            
            <button
              type="button"
              className="flex align-center justify-center h-full min-h-full w-full font-medium rounded-lg m-0 p-3 px-5 border-2 hover:bg-accents-9 bg-white"
              disabled={loading}
              onClick={() => handleOAuthSignIn('google')}
            >
              <Google />
              <span className="ml-2">{authState} with Google</span>
            </button>
          </div> */}

          {message.content && (
            <div className={`${message.type === 'error' ? 'bg-red-500 border-red-600 text-white' : 'bg-gray-200 border-gray-300' } border-4 p-4 rounded-xl text-center text-lg`}>
              {message.content === 'Signups not allowed for otp' ? 'We could not find an account with this email address.' : message.content}
            </div>
          )}
        </form>
      </div>
    </div>
  )
};

export default AuthForm;