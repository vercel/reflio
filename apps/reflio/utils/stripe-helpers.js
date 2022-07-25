import { supabaseAdmin } from './supabase-admin';
import { stripe } from './stripe';
import { invoicePayment, chargePayment } from './stripe-payment-helpers';
import { monthsBetweenDates } from './helpers';

export const createCommission = async(referralData, stripeId, referralId, email) => {
  console.log("Trace 1");

  const customer = await stripe.customers.list({
    email: email,
    limit: 1,
  }, {
    stripeAccount: stripeId
  });

  console.log("Trace 2");

  //Payment intent flow
  if(customer?.data?.length){

    console.log("Customer ID: ",customer?.data[0]?.id)

    console.log("Trace 3");

    await stripe.customers.update(
      customer?.data[0]?.id,
      {metadata: {reflio_referral_id: referralData?.data?.referral_id}},
      {stripeAccount: stripeId}
    );

    if(customer?.data[0]?.email === email){
      const paymentIntent = await stripe.paymentIntents.list({
        customer: customer?.data[0]?.id,
        limit: 1,
      }, {
        stripeAccount: stripeId
      });

      console.log("Trace 4");

      if(paymentIntent?.data?.length && paymentIntent?.data[0]?.metadata?.reflio_commission_id){

        //Check DB and make sure that the commission is still valid and exists.
        let commissionFromId = await supabaseAdmin
          .from('commissions')
          .select('commission_id, paid_at')
          .eq('commission_id', paymentIntent?.data[0]?.metadata?.reflio_commission_id)
          .single();

        if(commissionFromId?.data !== null){
          return "commission_exists"
        }

        console.log("Trace 5");
      }

      console.log("Trace 6");

      if(paymentIntent?.data[0]?.invoice){
        await invoicePayment(referralData, stripeId, referralId, paymentIntent, null);
        return "success";

      } else if(paymentIntent?.data[0]?.charges){
        await chargePayment(referralData, stripeId, referralId, paymentIntent);
        return "success";

      } else {
        return "commission_payment_calculation_error";
      }
    }
  }

  console.log("Trace 17");

  return "error";
};

export const editCommission = async(data) => {
  let paymentData = data?.data?.object ? data?.data?.object : null;

  console.log("-Trace 1")

  if(paymentData === null){
    console.log("-Trace 2")
    return "error";
  }
   
  const paymentIntent = await stripe.paymentIntents.retrieve(
    paymentData?.payment_intent,
    {stripeAccount: data?.account}
  );

  console.log("-Trace 3")

  if(paymentIntent?.metadata?.reflio_commission_id){
    console.log("-Trace 4")

    let commissionFromId = await supabaseAdmin
      .from('commissions')
      .select('referral_id')
      .eq('commission_id', paymentIntent?.metadata?.reflio_commission_id)
      .single();

    console.log("-Trace 5")

    if(commissionFromId?.data !== null){

      console.log("-Trace 6")

      let referralFromId = await supabaseAdmin
        .from('referrals')
        .select('commission_value', 'commission_type')
        .eq('referral_id', commissionFromId?.data?.referral_id)
        .single();

      console.log("-Trace 7")

      if(referralFromId?.data !== null){
        let paymentIntentTotal = paymentData?.amount;

        console.log("-Trace 8")
  
          //----CALCULATE REUNDS----
          const refunds = await stripe.refunds.list({
            payment_intent: paymentData?.payment_intent,
            limit: 100,
          }, {
            stripeAccount: data?.account
          });

          console.log("-Trace 9")
  
          if(refunds && refunds?.data?.length > 0){
            refunds?.data?.map(refund => {
              if(refund?.amount > 0){
                paymentIntentTotal = parseInt(paymentIntentTotal - refund?.amount);
              }
              console.log("-Trace 10")
            })
          }
          //----END CALCULATE REUNDS----

          console.log("-Trace 11")
  
          let commissionAmount = paymentIntentTotal > 0 ? referralFromId?.data?.commission_type === "fixed" ? referralFromId?.data?.commission_value : (parseInt((((parseFloat(paymentIntentTotal/100)*parseFloat(referralFromId?.data?.commission_value))/100)*100))) : 0;

          console.log("-Trace 12")

          console.log("paymentIntentTotal:")
          console.log(paymentIntentTotal)

          console.log("Commission amount:");
          console.log(commissionAmount);

          console.log("Commission ID:")
          console.log(paymentIntent?.metadata?.reflio_commission_id)

          const { error } = await supabaseAdmin
            .from('commissions')
            .update({
              commission_sale_value: paymentIntentTotal,
              commission_total: commissionAmount
            })
            .eq('commission_id', paymentIntent?.metadata?.reflio_commission_id);

          console.log("-Trace 13")
          
          console.log(error);

          if (error) return "error";

          console.log("-Trace 14")

          return "success";
      }
    }
  }

  console.log("-Trace 15")

  return "error";
};

export const findCommission = async(data) => {
  let paymentData = data?.data?.object ? data?.data?.object : null;
  
  console.log('--Trace 1')

  if(paymentData === null){
    console.log("--Trace 2")
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

  console.log("--Trace 3")

  if(customer?.metadata?.reflio_referral_id){
    console.log("--Trace 4")

    let referralFromId = await supabaseAdmin
      .from('referrals')
      .select('*')
      .eq('referral_id', customer?.metadata?.reflio_referral_id)
      .single();

    console.log("--Trace 5")

    if(referralFromId?.data !== null){
      console.log("--Trace 7")

      let earliestCommission = await supabaseAdmin
        .from('commissions')
        .select('created')
        .eq('referral_id', referralFromId?.data?.referral_id)
        .order('created', { ascending: true })
        .limit(1)

        console.log("--Trace 8")

        if(earliestCommission?.data !== null){
          let commissionFound = earliestCommission?.data[0];

          console.log("commissionFound?.created:")
          console.log(commissionFound?.created)

          console.log("--Trace 9")

          if(commissionFound?.created){
            let stripeDateConverted = new Date(paymentData?.created * 1000);
            let earliestCommissionDate = new Date(commissionFound?.created);
            let monthsBetween = monthsBetweenDates(stripeDateConverted, earliestCommissionDate);

            console.log("--Trace 10")

            console.log("monthsBetween:")
            console.log(monthsBetween)

            if(referralFromId?.data?.commission_period > monthsBetween){
              console.log("--Trace 11")
              if(paymentData?.invoice){
                console.log("--Trace 12")
                await invoicePayment(referralFromId, data?.account, referralFromId?.data?.referral_id, null, paymentData?.invoice);
                return "success";
              }
            }
          }
        }
    }
  }

  console.log("Returned and errored here");

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