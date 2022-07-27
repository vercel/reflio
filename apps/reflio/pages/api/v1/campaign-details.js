import { campaignInfo } from 'utils/useDatabase';
import Cors from 'cors';
import { getURL } from '@/utils/helpers';

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

const campaignDetails = async (req, res) => {

  // Run the middleware
  await runMiddleware(req, res, cors);

  const headers = req.headers;
  let body = req.body;
  try {
    body = JSON.parse(body);
  } catch (error) {
    console.log("Could not parse body")
  }

  console.log(body)
  
  let filteredReferer = null;
  if(headers?.origin) {
    filteredReferer = headers.origin.replace(/(^\w+:|^)\/\//, '').replace('www.', '');

  } else {
    return res.status(500).json({ statusCode: 500, referer: false });
  }

  try {
    if(filteredReferer !== null && body?.referralCode && body?.companyId){
      const details = await campaignInfo(body?.referralCode, body?.companyId);
      return res.status(200).json({ campaign_details: details }); 
    }

    return res.status(500).json({ statusCode: 500, verified: false });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: { statusCode: 500, verified: false } });

  }
};

export default campaignDetails;