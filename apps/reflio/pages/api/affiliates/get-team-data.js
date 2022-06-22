import { getUser } from '@/utils/supabase-admin';
import { teamData } from '@/utils/useDatabase';

const getTeamData = async (req, res) => {
  if (req.method === 'POST') {
    const token = req.headers.token;
    const { userEmail, teamId } = req.body;

    try {
      const user = await getUser(token);

      if(user){
        const {teamDataReturned, userPermissions} = await teamData(userEmail, teamId, user);
        return res.status(200).json({ teamDataReturned, userPermissions });

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

export default getTeamData;
