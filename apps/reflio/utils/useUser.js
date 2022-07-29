import { useEffect, useState, createContext, useContext } from 'react';
import { supabase } from './supabase-client';
import { slugifyString } from './helpers';
import { useRouter } from 'next/router';

export const UserContext = createContext();

export const UserContextProvider = (props) => {
  const router = useRouter();
  const [userLoaded, setUserLoaded] = useState(false);
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [team, setTeam] = useState(null);
  const [userFinderLoaded, setUserFinderLoaded] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [planDetails, setPlanDetails] = useState(null);

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
  const getTeam = () => supabase.from('teams').select('*').single();
  const getUserDetails = () => supabase.from('users').select('*').single();
  const getSubscription = () =>
    supabase
      .from('subscriptions')
      .select('*, prices(*, products(*))')
      .in('status', ['trialing', 'active'])
      .single();

  useEffect(() => {
    if (user) {
      Promise.allSettled([getTeam(), getUserDetails(), getSubscription()]).then(
        (results) => {
          if(results[0].value.data !== null){
            setTeam(results[0].value.data);
          } else {
            setTeam('none');
          }
          setUserDetails(results[1].value.data);
          setSubscription(results[2].value.data);

          if(results[2].value.data !== null){
            setPlanDetails(results[2].value.data.prices.products.name);
          } else {
            setPlanDetails('free');
          }

          setUserLoaded(true);
          setUserFinderLoaded(true);
        }
      );
    }
  }, [user]);

  // if(user && session && team === null && router?.pathname !== '/dashboard/create-team'){
  //   router.replace('/dashboard/create-team');
  // }

  const value = {
    session,
    user,
    team,
    userDetails,
    userLoaded,
    subscription,
    userFinderLoaded,
    planDetails,
    signIn: (options) => supabase.auth.signIn(options, {redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`}),
    signUp: (options) => supabase.auth.signUp(options, {redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`}),
    forgotPassword: (email) => supabase.auth.api.resetPasswordForEmail(email),
    signOut: () => {
      setUserDetails(null);
      setSubscription(null);
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

//Get user account
export const getCompanies = async (userId) => {
  const { data, error } = await supabase
  .from('companies')
  .select('*')
  .eq('id', userId)

  if(error) return error; 
  return data;
};

//Get user campaigns
export const getCampaigns = async (companyId) => {
  const { data, error } = await supabase
  .from('campaigns')
  .select('*')
  .eq('company_id', companyId)
  .order('created', { ascending: false })

  if(error) return error; 
  return data;
};

//Get user campaigns
export const getAffiliates = async (companyId) => {
  const { data, error } = await supabase
  .from('affiliates')
  .select(`
    *,
    details:invited_user_id (email)
  `)
  .eq('company_id', companyId)

  if(error) return error; 
  return data;
};

//Get user referrals
export const getReferrals = async (companyId, date) => {
  if(date !== null){
    const { data, count, error } = await supabase
    .from('referrals')
    .select(`
        *,
        campaign:campaign_id (campaign_name),
        affiliate:affiliate_id (invite_email)
      `, 
      { count: "exact" }
    )
    .eq('company_id', companyId)
    .lt('created', [date])
    .order('created', { ascending: false })
    .limit(30)

    if(error) return "error"; 
    return { data, count };
    
  } else {
    const { data, count, error } = await supabase
    .from('referrals')
    .select(`
        *,
        campaign:campaign_id (campaign_name),
        affiliate:affiliate_id (invite_email)
      `, 
      { count: "exact" }
    )
    .eq('company_id', companyId)
    .order('created', { ascending: false })
    .limit(30)

    if(error) return "error"; 
    return { data, count };
  }
};

//Get user referrals
export const getSales = async (companyId, date, page) => {
  if(date !== null){
    const { data, count, error } = await supabase
    .from('commissions')
    .select(`
        *,
        campaign:campaign_id (campaign_name),
        affiliate_email:affiliate_id (details:invited_user_id(email,paypal_email))

      `, 
      { count: "exact" }
    )
    .eq('company_id', companyId)
    .lt('created', [date])
    .order('created', { ascending: false })
    .limit(30)

    if(error) return "error"; 
    return { data, count };
    
  } else {
    const { data, count, error } = await supabase
    .from('commissions')
    .select(`
        *,
        campaign:campaign_id (campaign_name),
        affiliate_email:affiliate_id (details:invited_user_id(email,paypal_email))
      `, 
      { count: "exact" }
    )
    .eq('company_id', companyId)
    .order('created', { ascending: false })
    .limit(30)

    if(error) return "error"; 
    return { data, count };
  }
};

//Create company
export const newTeam = async (user, form) => {
  if(!form?.team_name) return "error";

  console.log("User:")
  console.log(user)

  const { data, error } = await supabase.from('teams').insert({
    id: user?.id,
    team_name: form?.team_name
  });

  console.log("Data:")
  console.log(data)

  console.log("Error:")
  console.log(error)

  if(data && data[0]?.team_id){
    const userUpdate = await supabase
      .from('users')
      .update({
        team_id: data[0]?.team_id
      })
      .eq('id', user?.id);

      if(userUpdate?.data && userUpdate?.data !== null){
        return "success";
      }
  }

  return "error";
};

export const newCompany = async (user, form) => {
  if(!form?.company_handle || !form?.company_url || !form?.company_name) return "error";

  const { data, error } = await supabase.from('companies').insert({
    id: user?.id,
    team_id: user?.team_id,
    company_name: form?.company_name,
    company_url: form?.company_url,
    company_handle: form?.company_handle,
    domain_verified: false
  });

  console.log(error);

  if (error) {
    if(error?.code === "23505"){
      return "duplicate"
    }
    
    return "error";
  } else {
    return data;
  }
};

export const handleActiveCompany = async (switchedCompany) => {
  let { data } = await supabase
    .from('companies')
    .select('*')
    .eq('active_company', true);

  if(data){
    data?.map(async company => {
      await supabase
        .from('companies')
        .update({
          active_company: false
        })
        .eq('company_id', company?.company_id);
    })
  }
    
  let { error } = await supabase
    .from('companies')
    .update({
      active_company: true
    })
    .eq('company_id', switchedCompany);
  if (error) return "error";

  return "success";
};

export const newCampaign = async (user, form, companyId) => {
  let formFields = form;
  formFields.id = user?.id;
  formFields.company_id = companyId;

  if(formFields.commission_value && formFields.commission_value <= 0){
    formFields.commission_value = 20;
  }

  if(formFields.cookie_window && formFields.cookie_window <= 0){
    formFields.cookie_window = 60;
  }

  if(formFields.commission_period && formFields.commission_period <= 0){
    formFields.commission_period = 12;
  }

  if(formFields.minimum_days_payout && formFields.minimum_days_payout <= 30){
    formFields.minimum_days_payout = 30;
  }

  if(formFields.default_campaign){
    formFields.default_campaign = true;
  }

  if(!formFields?.team_id){
    formFields.team_id = user?.team_id;
  }

  if(formFields.discount_code?.length === 0 || formFields.discount_code === null){
    formFields.discount_code = null;
    formFields.discount_type = null;
    formFields.discount_value = null;
  }

  let { data } = await supabase
    .from('campaigns')
    .select('*')
    .eq('default_campaign', true)
    .eq('company_id', companyId);

  if(data?.length === 0){
    formFields.default_campaign = true;
  }
  
  if(formFields.default_campaign && formFields.default_campaign === true && data?.length > 0){
    data?.map(async campaign => {
      await supabase
        .from('campaigns')
        .update({
          default_campaign: false
        })
        .eq('campaign_id', campaign?.campaign_id);
    })
  }

  const { error } = await supabase.from('campaigns').insert(formFields);

  console.log(error);

  if (error) return "error";

  return "success";
};

export const editCampaign = async (campaignId, form) => { 

  if(form.default_campaign){
    form.default_campaign = true;

    await supabase
      .from('campaigns')
      .update({
        default_campaign: false
      })
      .eq('default_campaign', true);
    
    const { error } = await supabase
      .from('campaigns')
      .update(form)
      .eq('campaign_id', campaignId);

    console.log(error);
  
    if (error) return "error";
  
    return "success";

  } else {
    const { error } = await supabase
      .from('campaigns')
      .update(form)
      .eq('campaign_id', campaignId);

      console.log(error);
  
    if (error) return "error";
  
    return "success";
  }

};

//New Stripe Account
export const newStripeAccount = async (userId, stripeId, companyId) => {
  const getAccountDetails = await fetch('/api/get-account-details', {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      accountId: stripeId
    })
  }).then(function(response) {
    return response.json();

  }).then(function(data) {
    return data;
  });

  const { error } = await supabase
    .from('companies')
    .update({
      stripe_account_data: getAccountDetails?.data,
      stripe_id: stripeId
    }).eq('company_id', companyId);

  if (error) {
    console.log('first error was here')
    return "error";
  } else {
    return "success";
  }

};

export const deleteCompany = async (id) => {
  const { error } = await supabase
    .from('companies')
    .delete()
    .match({ company_id: id })

    if (error) {
      return "error";
    } else {
      return "success";
    }
};

export const editCurrency = async (companyId, data) => {
  if(!data?.company_currency){
    return "error";
  }

  const { error } = await supabase
    .from('companies')
    .update({
      company_currency: data?.company_currency
    })
    .eq('company_id', companyId);

  if (error) return "error";

  return "success";
};

export const editCompanyWebsite = async (id, form) => {
  const { error } = await supabase
    .from('companies')
    .update({ 
      company_url: form?.company_url,
      domain_verified: false
    })
    .match({ company_id: id })

    if (error) {
      return "error";
    } else {
      return "success";
    }
};

export const editCompanyHandle = async (id, form) => {
  if(!form?.company_handle) return "error";
  
  const { error } = await supabase
    .from('companies')
    .update({ 
      company_handle: slugifyString(form?.company_handle)
    })
    .match({ company_id: id })

    if (error) {

      if(error?.code === "23505"){
        console.log("was duplicate!!!!!")
        return "duplicate"
      }
      
      return "error";
    } else {
      return "success";
    }
};

export const disableEmails = async (id, type) => {
  const { error } = await supabase
    .from('companies')
    .update({ disable_emails: type})
    .match({ company_id: id })

    if (error) {
      return "error";
    } else {
      return "success";
    }
};

export const archiveSubmission = async (id, type) => {
  const { error } = await supabase
    .from('submissions')
    .update({ archived: type})
    .match({ submission_id: id })

    if (error) {
      return "error";
    } else {
      return "success";
    }
};

//Upload logo to log
export const uploadLogoImage = async (companyId, file) => {
  const modifiedId = companyId?.replace('_', '-');
  const { data, error } = await supabase.storage
  .from('company-assets')
  .upload(`${modifiedId}.png`, file, {
    cacheControl: '0',
    upsert: true
  })

  console.log(error)

  if (error) return error;

  if(data?.Key){
    const { error } = await supabase
    .from('companies')
    .update({
      company_image: data?.Key,
    }).eq('company_id', companyId);

    if (error) return error;
  }
  
  return data;
};