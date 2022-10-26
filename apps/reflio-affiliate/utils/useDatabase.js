import { supabaseAdmin } from './supabase-admin';

//Get user campaigns
export const getAffiliatePrograms = async (userId) => {
  const { data, error } = await supabaseAdmin
  .from('affiliates')
  .select('*')
  .eq('invited_user_id', userId)
  .eq('accepted', true)

  if(error){
    return [];
  }

  let affilateData = data;

  if(data && data.length > 0){
    await Promise.all(affilateData?.map(async (item) => {
      let { data } = await supabaseAdmin
      .from('companies')
      .select('company_name, stripe_account_data, company_image, company_url, company_currency')
      .eq('company_id', item?.company_id)
      .single()

      if(data){
        item.company_name = data?.company_name;

        if(data?.stripe_account_data?.settings?.branding?.primary_color){
          item.branding_colour = data?.stripe_account_data?.settings?.branding?.primary_color;
        } else {
          item.branding_colour = null;
        }

        if(data?.company_image !== null){
          item.company_image = data?.company_image;
        } else {
          item.company_image = null;
        }

        if(data?.company_url !== null){
          item.company_url = data?.company_url;
        } else {
          item.company_url = null;
        }

        if(data?.company_currency !== null){
          item.company_currency = data?.company_currency;
        } else {
          item.company_currency = null;
        }
      }
    }));
    await Promise.all(affilateData?.map(async (item) => {
      let { data } = await supabaseAdmin
      .from('campaigns')
      .select('campaign_name, commission_type, commission_value')
      .eq('campaign_id', item?.campaign_id)
      .single()

      if(data){
        item.campaign_name = data?.campaign_name;
        item.commission_type = data?.commission_type;
        item.commission_value = data?.commission_value;

        let referralsQuery = await supabaseAdmin
          .from('referrals')
          .select('referral_id')
          .eq('affiliate_id', affilateData[0]?.affiliate_id)
          .eq('campaign_id', item?.campaign_id)
    
        if(referralsQuery?.data !== null){
          item.campaign_referrals = referralsQuery?.data?.length;
        } else {
          item.campaign_referrals = 0;
        }

      } else {
        item.campaign_valid = false;
      }
    }));

    if(affilateData){
      await Promise.all(affilateData?.map(async (item) => {
        let commissionsQuery = await supabaseAdmin
          .from('commissions')
          .select('commission_total')
          .eq('campaign_id', item?.campaign_id)
          .eq('affiliate_id', item?.affiliate_id)
    
        if(commissionsQuery?.data !== null){
          let commissionValue = 0;
          commissionsQuery?.data?.map(commission => {
            if(commission?.commission_total > 0){
              commissionValue = commissionValue + commission?.commission_total;
            }
          })
          item['commissions_value'] = commissionValue > 0 ? commissionValue : 0;
        }  
      }));
    }
  }

  return {affilateData};
};

//Get user campaigns
export const getAffiliateProgramInvites = async (userEmail) => {
  let { data, error } = await supabaseAdmin
  .from('affiliates')
  .select('*')
  .eq('invite_email', userEmail)
  .eq('accepted', false)

  if(error){
    return [];
  }

  let affilateData = data;

  if(data && data.length > 0){
    await Promise.all(affilateData?.map(async (item) => {
      let { data } = await supabaseAdmin
      .from('companies')
      .select('company_name')
      .eq('company_id', item?.company_id)
      .single()

      if(data){
        item.company_name = data?.company_name;
      }
    }));
    await Promise.all(affilateData?.map(async (item) => {
      let { data } = await supabaseAdmin
      .from('campaigns')
      .select('campaign_name')
      .eq('campaign_id', item?.campaign_id)
      .single()

      if(data){
        item.campaign_name = data?.campaign_name;
      }
    }));
    return affilateData;
  }
};

//Affiliate invite button click
export const handleAffiliateInvite = async (user, handleType, affiliateId) => {
  if(handleType === "accept"){
    const { error } = await supabaseAdmin
      .from('affiliates')
      .update({
        invited_user_id: user?.id,
        accepted: true,
        invite_email: user?.email
      })
      .match({ affiliate_id: affiliateId })
      
      if(error) return "error";

  } else {

    const { error } = await supabaseAdmin
      .from('affiliates')
      .delete()
      .match({ affiliate_id: affiliateId })

      if (error) return "error";
  }

  return "success"
};

//Public campaign join button
export const handleCampaignJoin = async (user, companyId, campaignId) => {
  if(!user || !companyId || !campaignId) return "error";

  let { data } = await supabaseAdmin
    .from('campaigns')
    .select('team_id, campaign_public')
    .eq('campaign_id', campaignId)
    .single()
  
  if(data?.campaign_public === true){
    const { error } = await supabaseAdmin.from('affiliates').insert({
      id: user?.id,
      team_id: data?.team_id,
      company_id: companyId,
      campaign_id: campaignId,
      invite_email: 'manual',
      invited_user_id: user?.id,
      accepted: true,
    });
  
    if (error) {
      return "error";
    } else {
      return "success";
    }
  } else {
    return "private";
  }
    
};

//Get public campaigns
export const getPublicCampaign = async (handle, campaignId) => {
  let campaignDetails = {};

  if(handle){
    let { data } = await supabaseAdmin
    .from('companies')
    .select('company_id, company_image, company_name, company_currency')
    .eq('company_handle', handle)
    .single()

    if(data){
      campaignDetails.company_id = data?.company_id;
      campaignDetails.company_image = data?.company_image;
      campaignDetails.company_name = data?.company_name;
      campaignDetails.company_currency = data?.company_currency;
    }
  }

  if(campaignId === null && campaignDetails?.company_id){
    let { data } = await supabaseAdmin
      .from('campaigns')
      .select('campaign_id, campaign_name, commission_type, commission_value, campaign_public, custom_campaign_data')
      .eq('company_id', campaignDetails?.company_id)
      .eq('default_campaign', true)
      .single()

    if(data){
      campaignDetails.campaign_id = data?.campaign_id;
      campaignDetails.campaign_name = data?.campaign_name;
      campaignDetails.commission_type = data?.commission_type;
      campaignDetails.commission_value = data?.commission_value;
      campaignDetails.campaign_public = data?.campaign_public;
      campaignDetails.custom_campaign_data = data?.custom_campaign_data;
    }
  } else {
    let { data } = await supabaseAdmin
      .from('campaigns')
      .select('campaign_id, campaign_name, commission_type, commission_value, campaign_public, custom_campaign_data')
      .eq('campaign_id', campaignId)
      .single()

    if(data){
      campaignDetails.campaign_id = data?.campaign_id;
      campaignDetails.campaign_name = data?.campaign_name;
      campaignDetails.commission_type = data?.commission_type;
      campaignDetails.commission_value = data?.commission_value;
      campaignDetails.campaign_public = data?.campaign_public;
      campaignDetails.custom_campaign_data = data?.custom_campaign_data;
    }
  }

  return campaignDetails;
};

export const changeReferralCode = async (userId, affiliateId, companyId, code) => {
  if(!code || !userId) return "error";
  
  const { data } = await supabaseAdmin
    .from('affiliates')
    .select('referral_code, campaign_id')
    .eq('referral_code', code)
    .eq('company_id', companyId)

  if(data !== null && data?.length > 0){
    return "match";
  }
  
  const { error } = await supabaseAdmin
    .from('affiliates')
    .update({ 
      referral_code: code
    })
    .match({ affiliate_id: affiliateId })
    .match({ id: userId })

    console.log("Error:::")
    console.log(error)
    
    if (error) {
      return "error";
    } else {
      return "success";
    }
};


//Get user referrals
export const getAffiliateReferrals = async (userId) => {
  let referralsData = [];

  let campaigns = await supabaseAdmin
    .from('affiliates')
    .select(`
        campaign:campaign_id (campaign_name),
        company:company_id (company_currency),
        campaign_id,
        affiliate_id
      `, 
    )
    .eq('invited_user_id', userId)
    .order('created', { ascending: false })

  if(campaigns?.data !== null){
    await Promise.all(campaigns?.data?.map(async (item) => {
      let { data } = await supabaseAdmin
        .from('referrals')
        .select('*')
        .eq('affiliate_id', item?.affiliate_id)
        .order('created', { ascending: false })

      if(data){
        data?.map((referral) => {
          if(item?.company?.company_currency){
            referral.company_currency = item?.company?.company_currency;
          }
          if(item?.campaign?.campaign_name){
            referral.campaign_name = item?.campaign?.campaign_name;
          }
          referralsData.push(referral);
        })
      }
    }));
  }

  return { referralsData };
};

//Get user referrals
export const getAffiliateCommissions = async (userId) => {
  let commissionsData = [];

  let campaigns = await supabaseAdmin
    .from('affiliates')
    .select(`
        campaign:campaign_id (campaign_name),
        company:company_id (company_currency),
        campaign_id,
        affiliate_id
      `, 
    )
    .eq('invited_user_id', userId)
    .order('created', { ascending: false })

  if(campaigns?.data !== null){
    await Promise.all(campaigns?.data?.map(async (item) => {
      let { data } = await supabaseAdmin
        .from('commissions')
        .select('*')
        .eq('affiliate_id', item?.affiliate_id)
        .order('created', { ascending: false })

      if(data){
        data?.map((commission) => {
          let payoutEligible = false;
          let dateToday = new Date();
          let commissionDueDate = new Date(commission?.commission_due_date);

          if(dateToday.getTime() >= commissionDueDate){
            payoutEligible = true;
          }

          commission.payout_eligible = payoutEligible;
          
          if(item?.company?.company_currency){
            commission.company_currency = item?.company?.company_currency;
          }
          if(item?.campaign?.campaign_name){
            commission.campaign_name = item?.campaign?.campaign_name;
          }

          
          commissionsData.push(commission);
        })
      }
    }));
  }

  return { commissionsData };
};