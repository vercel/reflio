import { getUser } from '@/utils/supabase-admin';
import { inviteAffiliate } from '@/utils/useDatabase';
import { sendEmail } from '@/utils/sendEmail';

const inviteUser = async (req, res) => {
  if (req.method === 'POST') {
    const token = req.headers.token;
    const { companyId, companyHandle, companyName, campaignId, emailInvites, logoUrl, emailSubject, emailContent } = req.body;
    
    try {
      const user = await getUser(token);
      let emailInvitesSplit = null;

      if(emailInvites && emailInvites?.includes(',')){
        emailInvitesSplit = emailInvites.split(',');
        if(emailInvitesSplit?.length >= 30){
          return res.status(500).json({ response: 'limit reached' });
        }
      }

      if(user){

        if(emailInvitesSplit === null){
          const invite = await inviteAffiliate(user, companyId, campaignId, emailInvites);

          if(invite === "success"){
            await sendEmail(logoUrl, emailSubject, emailContent, emailInvites, 'invite', companyName, campaignId, companyHandle);
            
            return res.status(200).json({ response: 'success' });
          }
        } else {
          await Promise.all(emailInvitesSplit?.map(async (inviteEmail) => {
            const invite = await inviteAffiliate(user, companyId, campaignId, inviteEmail);

            if(invite === "success"){
              await sendEmail(logoUrl, emailSubject, emailContent, inviteEmail, 'invite', companyName, campaignId, companyHandle);
            }
          }));
        }

        return res.status(200).json({ response: 'success' });

        // const invite = await editTeam(teamId, 'invite', formData, user);

        // if(invite === 'success'){
        //   const email = await sendEmail(`You have been invited to team ${teamData?.team_name} on SEOCopy 🤖`, formData?.invite_email, 'invite', teamData);

        //   if(email === 'success'){
        //     console.log('email success');

        //     return res.status(200).json({ response: 'success' });
        //   }
        // }

        // return res.status(500).json({ response: 'error' });

      } else {
        return res.status(500).json({ response: 'error' });
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

export default inviteUser;