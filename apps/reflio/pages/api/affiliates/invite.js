import { getUser } from '@/utils/supabase-admin';
import { inviteAffiliate } from '@/utils/useDatabase';
import { sendEmail } from '@/utils/sendEmail';
import { withSentry } from '@sentry/nextjs';

const inviteUser = async (req, res) => {
  if (req.method === 'POST') {
    const token = req.headers.token;
    const {
      companyId,
      name,
      vercel_username,
      companyHandle,
      companyName,
      campaignId,
      emailInvites,
      logoUrl,
      emailSubject,
      emailContent
    } = req.body;

    try {
      const user = await getUser(token);
      let emailInvitesSplit = null;

      if (emailInvites && emailInvites?.includes(',')) {
        emailInvitesSplit = emailInvites.split(',');
        if (emailInvitesSplit?.length >= 30) {
          return res.status(500).json({ response: 'limit reached' });
        }
      }

      if (user) {
        if (emailInvitesSplit === null) {
          const invite = await inviteAffiliate(
            user,
            companyId,
            campaignId,
            emailInvites,
            name,
            vercel_username
          );

          if (invite === 'success') {
            return res.status(200).json({ response: 'success' });
          }
        } else {
          await Promise.all(
            emailInvitesSplit?.map(async (inviteEmail) => {
              await inviteAffiliate(
                user,
                companyId,
                campaignId,
                inviteEmail,
                name,
                vercel_username
              );
            })
          );
          return res.status(200).json({ response: 'success' });
        }

        return res.status(500).json({ response: 'error' });
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

export default process.env.SENTRY_AUTH_TOKEN
  ? withSentry(inviteUser)
  : inviteUser;
