import { getCompanyFromExternal } from '@/utils/useDatabase';
import Cors from 'cors';
import { withSentry } from '@sentry/nextjs';

// Initializing the cors middleware
const cors = Cors({
  methods: ['GET', 'HEAD'],
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

const verifyCompany = async (req, res) => {

  // Run the middleware
  await runMiddleware(req, res, cors);

  const headers = req.headers;
  const body = req.body;
  let filteredReferer = null;

  if(headers?.origin) {
    filteredReferer = headers.origin.replace(/(^\w+:|^)\/\//, '').replace('www.', '');
    
  } else if(headers?.host) {
    filteredReferer = headers.host.replace(/(^\w+:|^)\/\//, '').replace('www.', '');

  } else {
    return res.status(500).json({ statusCode: 500, referer: false, error: "No host or origin" });
  }

  try {
    if(filteredReferer !== null){

      const projectVerify = await getCompanyFromExternal(filteredReferer);

      if(projectVerify === "success"){
        return res.status(200).json({ verified: true }); 

      } else {
        return res.status(500).json({ error: projectVerify });

      }
    }

    return res.status(500).json({ statusCode: 500, verified: false, referer: filteredReferer });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: { statusCode: 500, verified: false, referer: filteredReferer } });

  }
};

export default process.env.SENTRY_AUTH_TOKEN ? withSentry(verifyCompany) : verifyCompany;