/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import LoadingDots from '@/components/LoadingDots';
import { useUser } from '@/utils/useUser';
import { SEOMeta } from '@/templates/SEOMeta'; 
import { AffiliateLogo } from '@/components/Icons/AffiliateLogo';
import AuthForm from '@/components/AuthForm';

const AuthTemplate = ({ type }) => {
  const router = useRouter();
  const { user } = useUser();

  let authState = type === 'signin' ? "Sign in" : type === "signup" ? "Sign up" : "Sign in";

  useEffect(() => {
    if (user) {
      router.replace('/dashboard');
    }
  }, [user]);

  if (!user)
    return (
      <>
        <div className="py-12">
          <div className="mb-6">
            <AffiliateLogo className="w-44 h-auto mx-auto"/>
          </div>
          <div className="p-10 rounded-xl bg-white border-4 border-gray-300 max-w-lg mx-auto">
            <AuthForm affiliate={true} type={type}/>
          </div>
        </div>
      </>
    );

  return (
    <>
      <div className="m-6">
        <LoadingDots />
      </div>
    </>
  );
};

export default AuthTemplate;
