import { getUser } from '../utils/supabase-admin';
import { handleCampaignJoin } from '../utils/useDatabase';

const campaignJoin = async (req, res) => {
  if (req.method === 'POST') {
    const token = req.headers.token;
    const { companyId, campaignId } = req.body;

    try {
      const user = await getUser(token);

      if(user){

        console.log(user?.id, companyId, campaignId)

        const status = await handleCampaignJoin(user, companyId, campaignId);

        return res.status(200).json({ status });

      } else {
        res.status(500).json({ error: { statusCode: 500, message: 'Not a valid UUID' } });
      }
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export default campaignJoin;