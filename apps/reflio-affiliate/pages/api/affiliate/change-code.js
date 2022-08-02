import { getUser } from '@/utils/supabase-admin';
import { changeReferralCode } from '@/utils/useDatabase';

const changeCode = async (req, res) => {
  if (req.method === 'POST') {
    const token = req.headers.token;
    const { affiliateId, companyId, userCode } = req.body;

    if(!affiliateId || !companyId || !userCode){
      res.status(500).json({ error: { statusCode: 500, message: 'Invalid props' } });
    }

    try {
      const user = await getUser(token);

      if(user){
        const code = await changeReferralCode(user?.id, affiliateId, companyId, userCode);

        return res.status(200).json({ response: code });

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

export default changeCode;