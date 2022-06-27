import { stripe } from '@/utils/stripe';
import {
  deleteIntegrationFromDB,
  editCommission
} from '@/utils/stripe-helpers';
// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false
  }
};

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(
      typeof chunk === "string" ? Buffer.from(chunk) : chunk
    );
  }
  return Buffer.concat(chunks);
}

const relevantEvents = new Set([
  'account.application.deauthorized',
  'account.updated',
  'charge.succeeded',
  'charge.refunded',
  'charge.refund.updated',
  'charge.updated'
]);

const customerEvents = async (req, res) => {
  if (req.method === 'POST') {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_CUSTOMER_WEBHOOK_SECRET;
    let event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err) {
      console.log(`❌ Error message: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    
    if (relevantEvents.has(event.type)) {
      try {
        switch (event.type) {
          case 'charge.refunded':
            await editCommission(event);
            break;
          case 'charge.refund.updated':
            await editCommission(event);
            break;
          case 'charge.updated':
            await editCommission(event);
            break;
          case 'account.application.deauthorized':
            if(event.data.object?.name === 'Reflio'){
              await deleteIntegrationFromDB(event?.account);
              break;
            } else {
              break;
            }
        }
      } catch (error) {
        console.log(error);
        return res.json({ error: 'Webhook handler failed. View logs.' });
      }
    }

    res.json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export default customerEvents;