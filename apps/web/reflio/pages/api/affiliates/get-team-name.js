import { getUser } from '@/utils/supabase-admin';
import { getTeamName } from '@/utils/useDatabase';

const teamName = async (req, res) => {
  if (req.method === 'POST') {
    const token = req.headers.token;
    const { teamId } = req.body;

    try {
      const user = await getUser(token);

      if(user){
        const name = await getTeamName(teamId);
        return res.status(200).json({ name });

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

export default teamName;
