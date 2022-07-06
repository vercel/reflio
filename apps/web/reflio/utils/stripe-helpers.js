import { supabaseAdmin } from './supabase-admin';
import { stripe } from './stripe';

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
        const invoice = await stripe.invoices.retrieve(
          paymentIntent?.data[0]?.invoice,
          {stripeAccount: stripeId}
        );

        console.log(invoice);
        
        let invoiceTotal = invoice?.total;

        console.log("Trace 7");

        console.log("Payment intent: ", invoice?.payment_intent);

        //----CALCULATE REUNDS----
        const refunds = await stripe.refunds.list({
          payment_intent: invoice?.payment_intent,
          limit: 100,
        }, {
          stripeAccount: stripeId
        });

        console.log("Trace 8");

        if(refunds && refunds?.data?.length > 0){
          refunds?.data?.map(refund => {
            if(refund?.amount > 0){
              invoiceTotal = parseInt(invoiceTotal - refund?.amount);
            }
          })

          console.log("Trace 9");
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

        console.log("Trace 10");
        
        if(invoice?.paid === true){
          invoice?.lines?.data?.map(line => {
            invoiceLineItems?.push(line?.description);
          })

          console.log("Trace 11");
        }

        let referralUpdate = await supabaseAdmin
          .from('referrals')
          .update({
            referral_converted: true
          })
          .eq('referral_id', referralId);

          console.log("Trace 12");

        if(!referralUpdate?.error){

          // newCommissionValues = await supabaseAdmin
          // .from('commissions')
          // .update({
          //   commission_sale_value: invoiceTotal,
          //   commission_total: commissionAmount,
          //   commission_description: invoiceLineItems.toString()
          // })
          // .eq('commission_id', commissionData?.commission_id);

          console.log("Trace 13");

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

          console.log("Trace 14");

          console.log(newCommissionValues)

          if(newCommissionValues?.data){

            console.log("Trace 15");

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

            console.log("Trace 16");

            return newCommissionValues?.data[0]?.commission_id;
          }
        }
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