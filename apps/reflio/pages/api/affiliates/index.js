import { supabaseAdmin } from '@/utils/supabase-admin';

export default async function Endpoint(req, res) {
  const { data, error } = await supabaseAdmin
    .from('affiliates')
    .select('invite_email,name,vercel_username,affiliate_id')
    .not('name', 'is', null)
    .not('vercel_username', 'is', null);
  if (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
    return;
  }
  res.json({
    affiliates: data.map((user) => {
      return {
        id: user.affiliate_id,
        name: user.name,
        username: user.vercel_username
      };
    })
  });
}
