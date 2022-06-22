import { getUser } from '@/utils/supabase-admin';
import { getAccountEmail } from '@/utils/useDatabase';

const getTeamDetails = async (req, res) => {
  if (req.method === 'POST') {
    const token = req.headers.token;
    const { userId } = req.body;

    try {
      const user = await getUser(token);

      if(user){
        const email = await getAccountEmail(userId);
        return res.status(200).json({ email });

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

export default getTeamDetails;
