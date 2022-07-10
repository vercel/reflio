import { supabaseAdmin } from './supabase-admin';
import { stripe } from './stripe';
import { invoicePayment, chargePayment } from './stripe-payment-helpers';

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

    // if(!customer?.data[0]?.metadata?.reflio_referral_id){
    //   //Add parameter to Stripe customer
    //   await stripe.customers.update(
    //     customer?.data[0]?.id,
    //     {metadata: {reflio_referral_id: referralData?.data?.referral_id}},
    //     {stripeAccount: stripeId}
    //   );
    // } else {
    //   console.log("---Customer already has metadata---")
    //   console.log(customer?.data[0]?.metadata?.reflio_referral_id)
    // }

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
        await invoicePayment(referralData, stripeId, referralId, paymentIntent);

      } else if(paymentIntent?.data[0]?.charges){
        await chargePayment(referralData, stripeId, referralId, paymentIntent);

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