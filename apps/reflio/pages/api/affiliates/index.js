import { supabaseAdmin } from '@/utils/supabase-admin';
export default async function Endpoint(req, res) {
  const { data, error } = await supabaseAdmin
    .from('affiliates')
    .select('invite_email,name,vercelUsername')
    .not('name', 'is', null)
    .not('vercelUsername', 'is', null);
  if (error) {
    console.error(error);
    res.code(500).json({ error: 'Internal server error.' });
    return;
  }
  res.json({
    affiliates: data.map((user) => {
      return {
        name: user.name,
        username: user.vercelUsername,
        email: user.invite_email
      };
    })
  });
}
