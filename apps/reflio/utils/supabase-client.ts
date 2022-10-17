import { createClient } from '@supabase/supabase-js';

const supabaseUrl = String(process.env.NEXT_PUBLIC_SUPABASE_URL);
const supabaseAnonKey = String(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

export const getActiveProductsWithPrices = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index')
    .order('unit_amount', { foreignTable: 'prices' });

  if (error) {
    console.log(error.message);
    throw error;
  }

  return data || [];
};

export const updateUserName = async (user: any, name: any) => {
  await supabase
    .from('users')
    .update({
      full_name: name
    })
    .eq('id', user.id);
};
