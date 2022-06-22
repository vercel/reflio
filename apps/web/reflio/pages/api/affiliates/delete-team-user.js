import { getUser } from '@/utils/supabase-admin';
import { editTeam } from '@/utils/useDatabase';

const deleteTeamUser = async (req, res) => {
  if (req.method === 'POST') {
    const token = req.headers.token;
    const { teamId, formData } = req.body;

    try {
      const user = await getUser(token);

      if(user){
        const deleteUser = await editTeam(teamId, 'delete', formData, user);

        if(deleteUser === 'success'){
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

export default deleteTeamUser;