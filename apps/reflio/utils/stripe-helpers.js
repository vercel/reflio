import { supabaseAdmin } from './supabase-admin';
import { stripe } from './stripe';
import { invoicePayment, chargePayment } from './stripe-payment-helpers';
import { monthsBetweenDates } from './helpers';

export const createCommission = async(data, stripeId, manualReferralId) => {
  let paymentData = data?.data?.object ? data?.data?.object : data?.id ? data : null;
  let referralId = null;

  //Get customer object from payment data customer ID
  const customer = await stripe.customers.retrieve(
    paymentData?.customer,
    {stripeAccount: stripeId ? stripeId : data?.account}
  );

  //Check if customer has a referral ID
  if(customer?.metadata?.reflio_referral_id){
    referralId = customer?.metadata?.reflio_referral_id;

    //If customer doesn't have a referral ID... check if the payment object does
  } else if(paymentData?.metadata?.reflio_referral_id){
    referralId = paymentData?.metadata?.reflio_referral_id;

    //Update customer with referral ID
    await stripe.customers.update(
      customer?.id,
      {metadata: {reflio_referral_id: paymentData?.metadata?.reflio_referral_id}},
      {stripeAccount: stripeId ? stripeId : data?.account}
    );
  }

  if(referralId === null && manualReferralId){
    referralId = manualReferralId;
  }

  //Check if referral ID exists before continuing
  if(referralId){

    //Check if paymentIntent exists
    const paymentIntent = await stripe.paymentIntents.retrieve(
      paymentData?.payment_intent ? paymentData?.payment_intent : paymentData?.id,
      {stripeAccount: stripeId ? stripeId : data?.account}
    );

    //If there's no payment intent... back out
    if(!paymentIntent){
      return "no_payment_intent_found";
    }

    //Check if payment intent already has a commission associated with it
    if(paymentIntent?.metadata?.reflio_commission_id){
      return "commission_exists";
    }
    
    //Check if referral is valid in DB
    let referralFromId = await supabaseAdmin
      .from('referrals')
      .select('*')
      .eq('referral_id', referralId)
      .single();
      
    //If referral is valid, continue
    if(referralFromId?.data !== null){

      let continueProcess = true;

      //Check if there is an earlier commission with the same referral ID... if so, check if payment limit has been reached
      let earliestCommission = await supabaseAdmin
        .from('commissions')
        .select('created')
        .eq('referral_id', referralId)
        .order('created', { ascending: true })
        .limit(1)

      if(earliestCommission?.data !== null){
        let commissionFound = earliestCommission?.data[0];

        if(commissionFound?.created){
          let stripeDateConverted = new Date(paymentData?.created * 1000);
          let earliestCommissionDate = new Date(commissionFound?.created);
          let monthsBetween = monthsBetweenDates(stripeDateConverted, earliestCommissionDate);

          if(referralFromId?.data?.commission_period < monthsBetween){
            continueProcess = false;
          }
        }
      }

      if(continueProcess === true){
        
        if(paymentIntent?.invoice){
          await invoicePayment(referralFromId, stripeId ? stripeId : data?.account, referralId, paymentIntent, null);
          return "success";
    
        } else if(paymentIntent?.charges){
          await chargePayment(referralFromId, stripeId ? stripeId : data?.account, referralId, paymentIntent);
          return "success";
    
        } else {
          return "commission_payment_calculation_error";
        }
      }
    }
  }

  return "error";
};

export const editCommission = async(data) => {
  let paymentData = data?.data?.object ? data?.data?.object : null;

  if(paymentData === null){
    return "error";
  }
   
  const paymentIntent = await stripe.paymentIntents.retrieve(
    paymentData?.payment_intent,
    {stripeAccount: data?.account}
  );

  if(paymentIntent?.metadata?.reflio_commission_id){
    let commissionFromId = await supabaseAdmin
      .from('commissions')
      .select('referral_id')
      .eq('commission_id', paymentIntent?.metadata?.reflio_commission_id)
      .single();

    if(commissionFromId?.data !== null){
      let referralFromId = await supabaseAdmin
        .from('referrals')
        .select('commission_value', 'commission_type')
        .eq('referral_id', commissionFromId?.data?.referral_id)
        .single();

      if(referralFromId?.data !== null){
        let paymentIntentTotal = paymentData?.amount;

          //----CALCULATE REUNDS----
          const refunds = await stripe.refunds.list({
            payment_intent: paymentData?.payment_intent,
            limit: 100,
          }, {
            stripeAccount: data?.account
          });
  
          if(refunds && refunds?.data?.length > 0){
            refunds?.data?.map(refund => {
              if(refund?.amount > 0){
                paymentIntentTotal = parseInt(paymentIntentTotal - refund?.amount);
              }
            })
          }
          //----END CALCULATE REUNDS----
  
          let commissionAmount = paymentIntentTotal > 0 ? referralFromId?.data?.commission_type === "fixed" ? referralFromId?.data?.commission_value : (parseInt((((parseFloat(paymentIntentTotal/100)*parseFloat(referralFromId?.data?.commission_value))/100)*100))) : 0;

          const { error } = await supabaseAdmin
            .from('commissions')
            .update({
              commission_sale_value: paymentIntentTotal,
              commission_total: commissionAmount
            })
            .eq('commission_id', paymentIntent?.metadata?.reflio_commission_id);

          if (error) return "error";

          return "success";
      }
    }
  }

  return "error";
};

export const findCommission = async(data) => {
  let paymentData = data?.data?.object ? data?.data?.object : null;
  
  if(paymentData === null){
    return "error";
  }

  if(!paymentData?.payment_intent){
    return "no payment intent";
  }

  if(!paymentData?.customer){
    return "no customer";
  }

  const customer = await stripe.customers.retrieve(
    paymentData?.customer,
    {stripeAccount: data?.account}
  );

  if(customer?.metadata?.reflio_referral_id){
    let referralFromId = await supabaseAdmin
      .from('referrals')
      .select('*')
      .eq('referral_id', customer?.metadata?.reflio_referral_id)
      .single();

    if(referralFromId?.data !== null){
      let earliestCommission = await supabaseAdmin
        .from('commissions')
        .select('created')
        .eq('referral_id', referralFromId?.data?.referral_id)
        .order('created', { ascending: true })
        .limit(1)

        if(earliestCommission?.data !== null){
          let commissionFound = earliestCommission?.data[0];

          if(commissionFound?.created){
            let stripeDateConverted = new Date(paymentData?.created * 1000);
            let earliestCommissionDate = new Date(commissionFound?.created);
            let monthsBetween = monthsBetweenDates(stripeDateConverted, earliestCommissionDate);

            if(referralFromId?.data?.commission_period > monthsBetween){
              if(paymentData?.invoice){
                await invoicePayment(referralFromId, data?.account, referralFromId?.data?.referral_id, null, paymentData?.invoice);
                return "success";
              }
            }
          }
        }
    }
  }

  return "error";

}

//Deletes stripe ID from company account
export const deleteIntegrationFromDB = async (stripeId) => {
  const { error } = await supabaseAdmin
  .from('companies')
  .update({
    stripe_id: null
  })
  .eq({ stripe_id: stripeId })
  if (error) return "error";
};

//Updates customer with referral ID meta info if referral exists with customer email
export const updateCustomer = async (data) => {
  let customerData = data?.data?.object ? data?.data?.object : null;

  if(!customerData?.email || customerData?.email === null){
    return "no_customer_email";
  }

  //Check if referral exists with customer email
  let referralFromCustomerEmail = await supabaseAdmin
    .from('referrals')
    .select('*')
    .eq('referral_reference_email', customerData?.email)
    .order('created', { ascending: true })
    .limit(1)

  console.log("FINDING CUSTOMER!!!!")
  console.log(referralFromCustomerEmail);

  if(referralFromCustomerEmail?.data !== null){
    let foundReferral = referralFromCustomerEmail?.data[0];

    //Update customer with referral ID
    await stripe.customers.update(
      customerData?.id,
      {metadata: {reflio_referral_id: foundReferral?.referral_id}},
      {stripeAccount: data?.account}
    );

    return "success";
  }

  return "error";
};