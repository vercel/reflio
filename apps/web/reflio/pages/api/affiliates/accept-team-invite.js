import { getUser } from '@/utils/supabase-admin';
import { acceptInvite } from '@/utils/useDatabase';

const acceptTeamInvite = async (req, res) => {
  if (req.method === 'POST') {
    const token = req.headers.token;
    const { userEmail, teamId } = req.body;

    try {
      const user = await getUser(token);

      if(user){
        const invite = await acceptInvite(userEmail, teamId, user);

        if(invite === 'success'){
          return res.status(200).json({ response: 'success' });
        }

        return res.status(500).json({ response: 'error' });

      } else {
        return res.status(200).json({ response: 'error' });
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

export default acceptTeamInvite;