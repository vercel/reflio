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
      .select('company_name, stripe_account_data, company_image, company_url')
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
      } else {
        item.campaign_valid = false;
      }
    }));
    return affilateData;
  }
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

  console.log('running join')

  let { data } = await supabaseAdmin
    .from('campaigns')
    .select('campaign_public')
    .eq('campaign_id', campaignId)
    .single()
  
  if(data?.campaign_public === true){
    const { error } = await supabaseAdmin.from('affiliates').insert({
      id: user?.id,
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

  console.log(handle)
  console.log(campaignId)

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
      .select('campaign_id, campaign_name, commission_type, commission_value, campaign_public')
      .eq('company_id', campaignDetails?.company_id)
      .eq('default_campaign', true)
      .single()

    if(data){
      campaignDetails.campaign_id = data?.campaign_id;
      campaignDetails.campaign_name = data?.campaign_name;
      campaignDetails.commission_type = data?.commission_type;
      campaignDetails.commission_value = data?.commission_value;
      campaignDetails.campaign_public = data?.campaign_public;
    }
  } else {
    let { data } = await supabaseAdmin
      .from('campaigns')
      .select('campaign_id, campaign_name, commission_type, commission_value, campaign_public')
      .eq('campaign_id', campaignId)
      .single()

    if(data){
      campaignDetails.campaign_id = data?.campaign_id;
      campaignDetails.campaign_name = data?.campaign_name;
      campaignDetails.commission_type = data?.commission_type;
      campaignDetails.commission_value = data?.commission_value;
      campaignDetails.campaign_public = data?.campaign_public;
    }
  }

  return campaignDetails;
};