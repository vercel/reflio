import { getReferralFromId } from '@/utils/useDatabase';
import Cors from 'cors';
import { withSentry } from '@sentry/nextjs';

// Initializing the cors middleware
const cors = Cors({
  methods: ['GET', 'POST', 'HEAD'],
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

const retrieveReferral = async (req, res) => {

  // Run the middleware
  await runMiddleware(req, res, cors);

  let body = req.body;
  try {
    body = JSON.parse(body);
  } catch (error) {
    console.log("Could not parse body")
  }

  try {
    if(body?.referralId && body?.companyId){
      const retrieve = await getReferralFromId(body?.referralId, body?.companyId);
      return res.status(200).json({ statusCode: 200, referral_details: retrieve }); 
    }

    return res.status(500).json({ statusCode: 500, verified: false });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: { statusCode: 500, verified: false } });

  }
};

export default process.env.SENTRY_AUTH_TOKEN ? withSentry(retrieveReferral) : retrieveReferral;