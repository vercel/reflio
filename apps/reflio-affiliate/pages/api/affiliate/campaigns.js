import { getUser } from '@/utils/supabase-admin';
import { getAffiliatePrograms } from '@/utils/useDatabase';

const affiliatePrograms = async (req, res) => {
  if (req.method === 'POST') {
    const token = req.headers.token;

    try {
      const user = await getUser(token);

      if(user){

        const {affilateData, referralsData} = await getAffiliatePrograms(user?.id);

        console.log(affilateData)

        return res.status(200).json({ affilateData, referralsData });

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

export default affiliatePrograms;
