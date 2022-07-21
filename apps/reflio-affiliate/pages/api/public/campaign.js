import { getPublicCampaign } from '../utils/useDatabase';

const publicCampaign = async (req, res) => {
  if (req.method === 'POST') {
    const { companyHandle, campaignId } = req.body;

    try {

        const campaign = await getPublicCampaign(companyHandle, campaignId);

        console.log(campaign);

        return res.status(200).json({ campaign });

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

export default publicCampaign;
