import { supabaseAdmin } from '@/utils/supabase-admin';

export default async function Endpoint(req, res) {
  const id = req.query.id;
  if (typeof id !== 'string') {
    res.status(400).json({ error: 'Invalid id.' });
    return;
  }
  const { data, error } = await supabaseAdmin
    .from('affiliates')
    .select('invite_email,name,vercel_username,affiliate_id')
    .not('name', 'is', null)
    .eq('vercel_username', id);

  if (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
    return;
  }

  if (data.length === 0) {
    res.status(404).json({ error: 'Affiliate not found.' });
    return;
  }

  const affiliate = data[0];

  res.json({
    affiliate: {
      id: affiliate.affiliate_id,
      name: affiliate.name,
      username: affiliate.vercel_username
    }
  });
}
