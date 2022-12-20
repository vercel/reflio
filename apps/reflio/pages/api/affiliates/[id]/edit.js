import { supabaseAdmin } from '@/utils/supabase-admin';

export default async function Endpoint(req, res) {
  const id = req.query.id;
  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid id.' });
  }
  const {
    companyId,
    name,
    vercel_username,
    campaignId,
    inviteEmail
  } = req.body;
  
    //Update affiliate
   const { error } = await supabaseAdmin
      .from('affiliates')
      .update({
        name: name,
        vercel_username: vercel_username,
        invite_email: inviteEmail,

      })
      .eq('company_id', companyId)
      .eq('campaign_id', campaignId)
      .eq('vercel_username', id);

  if (error) {
    return res.status(500).json({ response: 'error' });
  }

  return res.status(200).json({ response: 'success' });
}