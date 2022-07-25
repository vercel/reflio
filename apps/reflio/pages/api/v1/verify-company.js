import { getCompanyFromExternal } from 'utils/useDatabase';
import Cors from 'cors';

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

  } else {
    return res.status(500).json({ statusCode: 500, referer: false });
  }

  try {
    if(filteredReferer !== null){

      console.log("Filtered Referer: " + filteredReferer)

      const projectVerify = await getCompanyFromExternal(filteredReferer);

      if(projectVerify === "success"){
        return res.status(200).json({ verified: true }); 
      }

    }

    return res.status(500).json({ statusCode: 500, verified: false });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: { statusCode: 500, verified: false } });

  }
};

export default verifyCompany;