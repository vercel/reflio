import { supabaseAdmin } from './supabase-admin';
import { stripe } from './stripe';

export const createCommission = async(referralData, stripeId, referralId, email) => {
  const customer = await stripe.customers.list({
    email: email,
    limit: 1,
  }, {
    stripeAccount: stripeId
  });

  //Payment intent flow
  if(customer?.data?.length){

    console.log("Customer ID: ",customer?.data[0]?.id)

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
      }

      if(paymentIntent?.data[0]?.invoice){
        const invoice = await stripe.invoices.retrieve(
          paymentIntent?.data[0]?.invoice,
          {stripeAccount: stripeId}
        );
        
        let invoiceTotal = invoice?.total;

        //----CALCULATE REUNDS----
        const refunds = await stripe.refunds.list({
          payment_intent: invoice?.payment_intent,
          limit: 10,
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
        
        if(invoice?.paid === false){
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

          // newCommissionValues = await supabaseAdmin
          // .from('commissions')
          // .update({
          //   commission_sale_value: invoiceTotal,
          //   commission_total: commissionAmount,
          //   commission_description: invoiceLineItems.toString()
          // })
          // .eq('commission_id', commissionData?.commission_id);

          let newCommissionValues = await supabaseAdmin.from('commissions').insert({
            id: referralData?.data?.id,
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

            return newCommissionValues?.data[0]?.commission_id;
          }
        }
      }
    }
  }

  return "error";
}