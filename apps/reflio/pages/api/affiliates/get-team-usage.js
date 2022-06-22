import { getUser } from '@/utils/supabase-admin';
import { getTeamUsage } from '@/utils/useDatabase';

const teamUsage = async (req, res) => {
  if (req.method === 'POST') {
    const token = req.headers.token;
    const { teamId } = req.body;

    try {
      const user = await getUser(token);

      if(user){
        const usage = await getTeamUsage(teamId);
        return res.status(200).json({ usage });

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

export default teamUsage;
