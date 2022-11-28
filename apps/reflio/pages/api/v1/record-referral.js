import {
  verifyReferral,
  fireRecordImpression,
  createReferral
} from '@/utils/useDatabase';
import Cors from 'cors';
import { withSentry } from '@sentry/nextjs';
import { supabaseAdmin } from '@/utils/supabase-admin';

// Initializing the cors middleware
const cors = Cors({
  methods: ['POST']
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

const COMPANY_ID = '5mha33r7ploqt29';

const recordImpression = async (req, res) => {
  console.log('Impression API Call');

  // Run the middleware
  await runMiddleware(req, res, cors);

  let body = req.body;
  try {
    body = JSON.parse(body);
  } catch (error) {
    console.log('Could not parse body');
  }

  try {
    console.log('Trying...');

    if (body?.vercel_username) {
      console.log('Has items');

      const vercel_username = body.vercel_username;

      const { data } = await supabaseAdmin
        .from('affiliates')
        .select('affiliate_id')
        .eq('vercel_username', vercel_username);

      if (!data)
        return res.status(500).json({ statusCode: 500, verified: false });

      if (data.length <= 0)
        return res.status(404).json({ statusCode: 404, verified: false });

      const { affiliate_id } = data[0];

      const referralVerify = await verifyReferral(affiliate_id, COMPANY_ID);

      if (
        referralVerify !== 'error' &&
        referralVerify?.affiliate_id &&
        referralVerify?.campaign_id
      ) {
        console.log('Referral verified...');

        const impression = await fireRecordImpression(
          referralVerify?.affiliate_id
        );

        console.log('Impression:');
        console.log(impression);

        if (impression === 'success') {
          const referral = await createReferral(referralVerify);

          if (referral !== 'error') {
            return res
              .status(200)
              .json({ statusCode: 200, referral_details: referral });
          }
        }
      }
    }

    return res.status(500).json({ statusCode: 500, verified: false });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: { statusCode: 500, verified: false } });
  }
};

export default process.env.SENTRY_AUTH_TOKEN
  ? withSentry(recordImpression)
  : recordImpression;
