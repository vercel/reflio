import { useEffect, useState, createContext, useContext } from 'react';
import { supabase } from './supabase-client';

export const UserContext = createContext();

export const UserContextProvider = (props) => {
  const [userLoaded, setUserLoaded] = useState(false);
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [userFinderLoaded, setUserFinderLoaded] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const session = supabase.auth.session();
    setSession(session);
    setUser(session?.user ?? null);
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    setUserFinderLoaded(true);

    return () => {
      authListener.unsubscribe();
    };
  }, []);

  const getUserDetails = () => supabase.from('users').select('*').eq('id', user?.id).single();
  useEffect(() => {
    if (user) {
      Promise.allSettled([getUserDetails()]).then(
        (results) => {
          setUserDetails(results[0].value.data);
          setUserLoaded(true);
          setUserFinderLoaded(true);
        }
      );
    }
  }, [user]);

  const value = {
    session,
    user,
    userDetails,
    userLoaded,
    userFinderLoaded,
    signIn: (options) => supabase.auth.signIn({email: options.email}, {shouldCreateUser: options.shouldCreateUser, redirectTo: options.redirectTo}),
    signInWithPassword: (options) => supabase.auth.signIn({email: options.email, password: options.password}, {shouldCreateUser: options.shouldCreateUser, redirectTo: options.redirectTo}),
    signUp: (options) => supabase.auth.signUp({email: options.email, password: options.password}, {redirectTo: options.redirectTo}),
    forgotPassword: (email) => supabase.auth.api.resetPasswordForEmail(email),
    signOut: () => {
      setUserDetails(null);
      return supabase.auth.signOut();
    }
  };
  return <UserContext.Provider value={value} {...props} />;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a UserContextProvider.`);
  }
  return context;
};

//Reset Password
export const resetPassword = async (token, password) => {
  const { error, data } = await supabase.auth.api
    .updateUser(token, { password : password })

  if(error){
    return error;
  } else {
    return data
  }
};

export const paypalEmail = async (id, email) => {
  const { data, error } = await supabase
    .from('users')
    .update({ 
      paypal_email: email,
    })
    .match({ id: id })

    if (error) {
      return "error";
    } else {
      return "success";
    }
};