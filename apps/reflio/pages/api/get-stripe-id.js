import { stripe } from '@/utils/stripe';
import { withSentry } from '@sentry/nextjs';

const getAccountIdFromToken = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const response = await stripe.oauth.token({
        grant_type: 'authorization_code',
        code: req.body.stripeCode
      });
      console.log(response)
      return res.status(200).json({ stripe_id: response?.stripe_user_id });
    } catch (err) {
      // console.log(err);
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export default process.env.SENTRY_AUTH_TOKEN ? withSentry(getAccountIdFromToken) : getAccountIdFromToken;