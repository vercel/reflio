import { useEffect, useState, createContext, useContext } from 'react';
import { supabase } from './supabase-client';
import { slugifyString, LogSnagPost } from './helpers';
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
  const getUserDetails = () => supabase.from('users').select('*').eq('id', user?.id).single();
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
            setPlanDetails(results[2].value.data.prices.products.name.toLowerCase());
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
    signIn: (options) => supabase.auth.signIn({email: options.email}, {shouldCreateUser: options.shouldCreateUser, redirectTo: options.redirectTo}),
    signInWithPassword: (options) => supabase.auth.signIn({email: options.email, password: options.password}, {shouldCreateUser: options.shouldCreateUser, redirectTo: options.redirectTo}),
    signUp: (options) => supabase.auth.signUp({email: options.email, password: options.password}, {redirectTo: options.redirectTo}),
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
  .order('default_campaign', { ascending: false })
  .order('created', { ascending: false })

  let campaignsData = data;

  if(data){
    await Promise.all(data?.map(async (item) => {
      let affiliateQuery = await supabase
        .from('affiliates')
        .select('campaign_id', { count: 'exact' })
        .eq('campaign_id', item?.campaign_id)

      item['affiliate_users'] = affiliateQuery?.data;
      item['affiliate_count'] = affiliateQuery?.count;

      let commissionsQuery = await supabase
        .from('commissions')
        .select('commission_sale_value')
        .eq('campaign_id', item?.campaign_id)
        .lt('commission_due_date', [((new Date()).toISOString())])

      if(commissionsQuery?.data !== null){
        let commissionValue = 0;
        commissionsQuery?.data?.map(commission => {
          if(commission?.commission_sale_value > 0){
            commissionValue = commissionValue + commission?.commission_sale_value;
          }
        })
        item['commissions_value'] = commissionValue > 0 ? commissionValue : 0;
      }      
    }));
  }

  if(error) return error; 
  return campaignsData;
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

  let affiliatesData = data;

  if(data){
    await Promise.all(data?.map(async (item) => {
      let commissionsQuery = await supabase
        .from('commissions')
        .select('commission_sale_value')
        .eq('affiliate_id', item?.affiliate_id)
        .lt('commission_due_date', [((new Date()).toISOString())])

      if(commissionsQuery?.data !== null){
        let commissionValue = 0;
        commissionsQuery?.data?.map(commission => {
          if(commission?.commission_sale_value > 0){
            commissionValue = commissionValue + commission?.commission_sale_value;
          }
        })
        item['commissions_value'] = commissionValue > 0 ? commissionValue : 0;
      }      
    }));
  }

  if(error) return error; 
  return affiliatesData;
};

//Get user referrals
export const getReferrals = async (companyId, date) => {
  let query = supabase
    .from('referrals')
    .select(`
        *,
        campaign:campaign_id (campaign_name),
        affiliate:affiliate_id (details:invited_user_id(email))
      `, 
      { count: "exact" }
    )
    .eq('company_id', companyId)
    .order('created', { ascending: false })
    .limit(30);

  if(date !== null){
    query.lt('created', [date])
  }

  const { data, count, error } = await query;

  if(error) return "error"; 
  return { data, count };
};

//Get user referrals
export const getSales = async (companyId, date, page) => {
  let query = supabase
    .from('commissions')
    .select(`
        *,
        campaign:campaign_id (campaign_name),
        affiliate:affiliate_id (details:invited_user_id(email,paypal_email))
      `, 
      { count: "exact" }
    )
    .eq('company_id', companyId)
    .order('created', { ascending: false })
    .limit(30);

  if(date !== null){
    query.lt('created', [date])
  }

  if(page === "due"){
    query.lt('commission_due_date', [((new Date()).toISOString())]).is('paid_at', null)
  }

  if(page === "paid"){
    query.not('paid_at', 'is', null)
  }

  if(page === "pending"){
    query.gt('commission_due_date', [((new Date()).toISOString())]).is('paid_at', null)
  }

  const { data, count, error } = await query;

  if(error) return "error"; 
  return { data, count };
};

export const getReflioCommissionsDue = async (teamId) => {
  let query = supabase
    .from('commissions')
    .select(`
        *,
        campaign:campaign_id (campaign_name),
        affiliate:affiliate_id (details:invited_user_id(email,paypal_email))
      `, 
      { count: "exact" }
    )
    .eq('team_id', teamId)
    .eq('reflio_commission_paid', false)
    .lt('commission_due_date', [((new Date()).toISOString())])
    .is('paid_at', null)
    .order('created', { ascending: false });

  const { data, error } = await query;

  if(error) return "error"; 
  return { data };
};

export const payCommissions = async (companyId, checkedCommissions, eligibleCommissions) => {
  if(!companyId || !eligibleCommissions) return "error";

  try {    
    if(checkedCommissions.length === 0 || checkedCommissions === null){
      await Promise.all(eligibleCommissions?.map(async (item) => {
        await supabase
          .from('commissions')
          .update({
            paid_at: ((new Date()).toISOString())
          })
          .eq('commission_id', item?.commission_id)
      }));
    } else {
      await Promise.all(checkedCommissions?.map(async (item) => {
        await supabase
          .from('commissions')
          .update({
            paid_at: ((new Date()).toISOString())
          })
          .eq('commission_id', item)
      }));
    }

    return "success";

  } catch (error) {
    console.warn(error);
    return "error";
    
  }
};

//Create company
export const newTeam = async (user, form) => {
  if(!form?.team_name) return "error";

  const { data, error } = await supabase.from('teams').insert({
    id: user?.id,
    team_name: form?.team_name
  });

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

  if (error) {
    if(error?.code === "23505"){
      return "duplicate"
    }
    
    return "error";
  } else {
    return data;
  }
};

export const continueWithoutStripe = async (companyId) => {
  let { error } = await supabase
    .from('companies')
    .update({
      stripe_id: 'manual',
      stripe_account_data: 'manual'
    })
    .eq('company_id', companyId);

    console.log("error!!!")
    console.log(error)

  if (error) return "error";

  return "success";
}

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

  if(formFields.default_campaign && formFields.default_campaign === true){
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

  if (error) return "error";

  await LogSnagPost('new-campaign', `New campaign created (${formFields.campaign_name}), for company ${companyId}`)

  return "success";
};

export const editCampaign = async (user, campaignId, formFields) => { 
  
  //TO DO: FIX THIS DUPLICATE CODE FROM ABOVE ^
  if(formFields.commission_value && formFields.commission_value <= 0){
    formFields.commission_value = 20;
  }

  if(formFields.cookie_window && formFields.cookie_window <= 0){
    formFields.cookie_window = 60;
  }

  if(formFields.commission_period && formFields.commission_period <= 0){
    formFields.commission_period = 12;
  }

  if(formFields.minimum_days_payout && formFields.minimum_days_payout <= 0){
    formFields.minimum_days_payout = 30;
  }

  if(formFields.default_campaign){
    formFields.default_campaign = true;
  }

  if(!formFields?.team_id){
    formFields.team_id = user?.team_id;
  }

  if(formFields?.campaign_public){
    formFields.campaign_public = true;
  } else {
    formFields.campaign_public = false;
  }

  if(formFields.discount_code?.length === 0 || formFields.discount_code === null){
    formFields.discount_code = null;
    formFields.discount_type = null;
    formFields.discount_value = null;
  }

  if(formFields.default_campaign && formFields.default_campaign === true){
    formFields.default_campaign = true;

    await supabase
      .from('campaigns')
      .update({
        default_campaign: false
      })
      .eq('campaign_id', campaignId)
      .eq('default_campaign', true);
    
    const { error } = await supabase
      .from('campaigns')
      .update(formFields)
      .eq('campaign_id', campaignId);
  
    if (error) return "error";
  
    return "success";

  } else {
    const { error } = await supabase
      .from('campaigns')
      .update(formFields)
      .eq('campaign_id', campaignId);
  
    if (error) return "error";
  
    return "success";
  }
};

export const editCampaignMeta = async (campaignId, metaData) => { 
  if(!campaignId || !metaData) return "error";
  
  const { error } = await supabase
    .from('campaigns')
    .update({
      custom_campaign_data: metaData,
    }).
    eq('campaign_id', campaignId);
    
  if (error) return "error";

  return "success";
}

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
    return "error";
  } else {

    await LogSnagPost('stripe-connected', `New Stripe account connected for company ${companyId}`);

    return "success";
  }

};

export const manuallyVerifyDomain = async (companyId) => {
  let { error } = await supabase
  .from('companies')
  .update({
    domain_verified: true
  })
  .eq('company_id', companyId);

  if (error) return "error";

  return "success";
}

export const deleteAffiliate = async (id) => {
  const { error } = await supabase
    .from('affiliates')
    .delete()
    .match({ affiliate_id: id })

    if (error) {
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
  .upload(`${modifiedId}.${file.name}`, file, {
    cacheControl: '0',
    upsert: true
  })

  console.log("error:")
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