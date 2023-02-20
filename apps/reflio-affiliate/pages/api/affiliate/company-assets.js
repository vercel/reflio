import { getUser } from '@/utils/supabase-admin';
import { getCompanyAssets } from '@/utils/useDatabase';

const companyAssets = async (req, res) => {
  if (req.method === 'POST') {
    const token = req.headers.token;
    const { company_id, affiliate_id } = req.body;

    try {
      const user = await getUser(token);

      if(user){

        const assets = await getCompanyAssets(user?.id, affiliate_id, company_id);

        console.log('assets 2:')
        console.log(assets)

        return res.status(200).json({ assets: assets });

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

export default companyAssets;