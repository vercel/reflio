import { supabaseAdmin } from './supabase-admin';
import { stripe } from './stripe';

export const invoicePayment = async(referralData, stripeId, referralId, paymentIntent, invoiceId) => {  
  const invoice = await stripe.invoices.retrieve(
    invoiceId !== null ? invoiceId : paymentIntent?.data[0]?.invoice,
    {stripeAccount: stripeId}
  );
  
  let invoiceTotal = invoice?.total;

  //----CALCULATE REUNDS----
  const refunds = await stripe.refunds.list({
    payment_intent: invoice?.payment_intent,
    limit: 100,
  }, {
    stripeAccount: stripeId
  });

  if(refunds && refunds?.data?.length > 0){
    refunds?.data?.map(refund => {
      if(refund?.amount > 0){
        invoiceTotal = parseInt(invoiceTotal - refund?.amount);
      }
    })
  }
  //----END CALCULATE REUNDS----

  let dueDate = new Date();
  if(referralData?.data?.minimum_days_payout){
    dueDate.setDate(dueDate.getDate() + referralData?.data?.minimum_days_payout);
  } else {
    dueDate.setDate(dueDate.getDate() + 30)
  }
  let dueDateIso = dueDate.toISOString();
  let commissionAmount = invoiceTotal > 0 ? referralData?.data?.commission_type === "fixed" ? referralData?.data?.commission_value : (parseInt((((parseFloat(invoiceTotal/100)*parseFloat(referralData?.data?.commission_value))/100)*100))) : 0;
  let invoiceLineItems = [];
  
  if(invoice?.paid === true){
    invoice?.lines?.data?.map(line => {
      invoiceLineItems?.push(line?.description);
    })
  }

  let referralUpdate = await supabaseAdmin
    .from('referrals')
    .update({
      referral_converted: true
    })
    .eq('referral_id', referralId);

  if(!referralUpdate?.error){
    let newCommissionValues = await supabaseAdmin.from('commissions').insert({
      id: referralData?.data?.id,
      team_id: referralData?.data?.team_id,
      company_id: referralData?.data?.company_id,
      campaign_id: referralData?.data?.campaign_id,
      affiliate_id: referralData?.data?.affiliate_id,
      referral_id: referralData?.data?.referral_id,
      payment_intent_id: invoice?.payment_intent,
      commission_sale_value: invoiceTotal,
      commission_total: commissionAmount,
      commission_due_date: dueDateIso,
      commission_description: invoiceLineItems.toString()
    });

    if(newCommissionValues?.data){
      //Add parameter to Stripe payment intent
      await stripe.paymentIntents.update(
        invoice?.payment_intent,
        {metadata: {reflio_commission_id: newCommissionValues?.data[0]?.commission_id}},
        {stripeAccount: stripeId}
      );

      //Add parameter to Stripe invoice
      await stripe.invoices.update(
        invoice?.id,
        {metadata: {reflio_commission_id: newCommissionValues?.data[0]?.commission_id}},
        {stripeAccount: stripeId}
      );

      //Add parameter to Stripe customer
      await stripe.customers.update(
        invoice?.customer,
        {metadata: {reflio_referral_id: referralId}},
        {stripeAccount: stripeId}
      );

      return newCommissionValues?.data[0]?.commission_id;
    }
  }
};

export const chargePayment = async(referralData, stripeId, referralId, paymentIntent) => {
  console.log('----CHARGE PAYMENT FUNC ----');
  
  let validCharges = paymentIntent?.data[0]?.charges?.data?.filter(charge => charge?.amount_captured > 0);

  if(validCharges?.length === 0) {
    return  "no_valid_charges";
  }
  
  let chargeTotal = 0;

  validCharges?.map(charge => {
    chargeTotal = parseInt(chargeTotal + charge?.amount_captured);
  });

  //----CALCULATE REUNDS----
  const refunds = await stripe.refunds.list({
    payment_intent: paymentIntent?.data[0]?.id,
    limit: 100,
  }, {
    stripeAccount: stripeId
  });

  if(refunds && refunds?.data?.length > 0){
    refunds?.data?.map(refund => {
      if(refund?.amount > 0){
        chargeTotal = parseInt(chargeTotal - refund?.amount);
      }
    })
  }
  //----END CALCULATE REUNDS----

  let dueDate = new Date();
  if(referralData?.data?.minimum_days_payout){
    dueDate.setDate(dueDate.getDate() + referralData?.data?.minimum_days_payout);
  } else {
    dueDate.setDate(dueDate.getDate() + 30)
  }
  let dueDateIso = dueDate.toISOString();
  let commissionAmount = chargeTotal > 0 ? referralData?.data?.commission_type === "fixed" ? referralData?.data?.commission_value : (parseInt((((parseFloat(chargeTotal/100)*parseFloat(referralData?.data?.commission_value))/100)*100))) : 0;

  let referralUpdate = await supabaseAdmin
    .from('referrals')
    .update({
      referral_converted: true
    })
    .eq('referral_id', referralId);

  if(!referralUpdate?.error){
    let newCommissionValues = await supabaseAdmin.from('commissions').insert({
      id: referralData?.data?.id,
      team_id: referralData?.data?.team_id,
      company_id: referralData?.data?.company_id,
      campaign_id: referralData?.data?.campaign_id,
      affiliate_id: referralData?.data?.affiliate_id,
      referral_id: referralData?.data?.referral_id,
      payment_intent_id: paymentIntent?.data[0]?.id,
      commission_sale_value: chargeTotal,
      commission_total: commissionAmount,
      commission_due_date: dueDateIso,
      commission_description: null
    });

    if(newCommissionValues?.data){
      //Add parameter to Stripe payment intent
      await stripe.paymentIntents.update(
        paymentIntent?.data[0]?.id,
        {metadata: {reflio_commission_id: newCommissionValues?.data[0]?.commission_id}},
        {stripeAccount: stripeId}
      );

      //Add parameter to Stripe payment intent
      await stripe.paymentIntents.update(
        paymentIntent?.data[0]?.customer,
        {metadata: {reflio_referral_id: newCommissionValues?.data[0]?.referral_id}},
        {stripeAccount: stripeId}
      );

      validCharges?.map(async charge => {
        //Add parameter to Stripe invoice
        await stripe.charges.update(
          charge?.id,
          {metadata: {reflio_commission_id: newCommissionValues?.data[0]?.commission_id}},
          {stripeAccount: stripeId}
        );
      })

      return newCommissionValues?.data[0]?.commission_id;
    }
  }
};