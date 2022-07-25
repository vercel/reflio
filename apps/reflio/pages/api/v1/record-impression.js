import { getCompanyFromExternal, verifyReferral, fireRecordImpression, createReferral } from 'utils/useDatabase';
import Cors from 'cors';
import { getURL } from 'utils/helpers';

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

const recordImpression = async (req, res) => {

  // Run the middleware
  await runMiddleware(req, res, cors);

  const headers = req.headers;
  let body = req.body;
  try {
    body = JSON.parse(body);
  } catch (error) {
    console.log("Could not parse body")
  }
  let filteredReferer = null;
  if(headers?.origin) {
    filteredReferer = headers.origin.replace(/(^\w+:|^)\/\//, '').replace('www.', '');

  } else {
    console.log('1')
    return res.status(500).json({ statusCode: 500, referer: false });
  }

  try {
    if(filteredReferer !== null && body?.referralCode && body?.companyId){
      console.log('2')
      const referralVerify = await verifyReferral(body?.referralCode, body?.companyId);

      if(referralVerify !== "error" && referralVerify?.affiliate_id && referralVerify?.campaign_id){
        console.log('3')
        const impression = await fireRecordImpression(referralVerify?.affiliate_id);

        if(impression === "success"){
          console.log('4')
          const referral = await createReferral(referralVerify);

          if(referral !== "error"){
            return res.status(200).json({ referral_details: referral }); 
          }
        }
      }
    }

    
    return res.status(500).json({ statusCode: 500, verified: false });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: { statusCode: 500, verified: false } });

  }
};

export default recordImpression;