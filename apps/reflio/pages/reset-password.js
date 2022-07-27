import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useUser, resetPassword } from '@/utils/useUser';
import { SEOMeta } from '@/templates/SEOMeta'; 

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });
  const router = useRouter();
  const { user, forgotPassword } = useUser();
  let access_token = null;

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage({});

    const { error } = await forgotPassword(email);
    if (error) {
      setMessage({ type: 'error', content: error.message });
    } else {
      setMessage({
        type: 'note',
        content: 'Check your email for the password reset link.'
      });
    }
    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage({});

    const { error } = await resetPassword(access_token, password);
    if (error) {
      setMessage({ type: 'error', content: error.message });
    } else {
      setMessage({
        type: 'note',
        content: 'Your password has been reset'
      });
    }
    setTimeout(function () {
      router.push('/dashboard');
    }, 3000);
    setLoading(false);
  };

  if(router?.asPath?.indexOf("?passwordReset=true&access_token=") > 0){
    access_token = router?.asPath?.split("&access_token=")[1].split("&")[0];
  }

  useEffect(() => {
    if (user && router?.asPath?.indexOf("?passwordReset=true&access_token=") === -1) {
      router.replace('/dashboard');
    }
  }, [router, user]);

  return (
    <>
      <SEOMeta title="Reset Password"/>
      <div>
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8 bg-white rounded-xl p-10 shadow-lg border-4 border-primary-2">
            <div>
              <h1 className="text-center text-3xl font-extrabold text-gray-900">Reset your password</h1>
            </div>

            {
              router?.asPath?.indexOf("?passwordReset=true&access_token=") > 0 ?

                <form onSubmit={handleResetPassword} className="mt-8 space-y-6">
                  <input type="hidden" name="remember" defaultValue="true" />
                  <div className="rounded-md shadow-sm -space-y-px">
                    <div>
                      <label htmlFor="password" className="sr-only">
                        Password
                      </label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="password"
                        required
                        className="appearance-none rounded-none relative block w-full p-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none  focus:z-10 sm:text-sm"
                        placeholder="Password"
                        onChange={e=>{setPassword(e.target.value)}}
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary  focus:outline-none focus:ring-2 focus:ring-offset-2 "
                    >
                      Confirm new password
                    </button>
                  </div>

                  <div className="mt-3 text-center text-sm">
                    <span className="text-accents-2">Don&apos;t have an account?</span>
                    {` `}
                    <Link href="/#intro">
                      <a className="text-accents-1 font-bold hover:underline cursor-pointer">
                        Sign up.
                      </a>
                    </Link>
                  </div>

                  {message.content && (
                    <div
                      className={`${
                        message.type === 'error' ? 'text-pink' : 'text-green'
                      } border ${
                        message.type === 'error' ? 'border-pink' : 'border-green'
                      } p-3`}
                    >
                      {message.content}
                    </div>
                  )}
                </form>

              :

                <form onSubmit={handleForgotPassword} className="mt-8 space-y-6">
                  <input type="hidden" name="remember" defaultValue="true" />
                  <div className="rounded-md shadow-sm -space-y-px">
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
                        className="appearance-none rounded-none relative block w-full p-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none  focus:z-10 sm:text-sm"
                        placeholder="Email address"
                        onChange={e=>{setEmail(e.target.value)}}
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 "
                    >
                      Send password reset
                    </button>
                  </div>

                  <div className="mt-3 text-center text-sm">
                    <span className="text-accents-2">Don&apos;t have an account?</span>
                    {` `}
                    <Link href="/#intro">
                      <a className="text-accents-1 font-bold hover:underline cursor-pointer">
                        Sign up.
                      </a>
                    </Link>
                  </div>

                  {message.content && (
                    <div
                      className={`${
                        message.type === 'error' ? 'text-pink' : 'text-green'
                      } border ${
                        message.type === 'error' ? 'border-pink' : 'border-green'
                      } p-3`}
                    >
                      {message.content}
                    </div>
                  )}
                </form>
            }
            

          </div>
        </div>
      </div>
    </>
  );

};

export default ForgotPassword;