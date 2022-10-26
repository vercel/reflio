import { getUser } from '@/utils/supabase-admin';
import { billingGenerateInvoice } from '@/utils/useDatabase';
import { withSentry } from '@sentry/nextjs';

const teamInvoice = async (req, res) => {
  if (req.method === 'POST') {
    const token = req.headers.token;
    const { currency, commissions } = req.body;
    
    try {
      const user = await getUser(token);

      if(user){
        const data = await billingGenerateInvoice(user, currency, commissions);

        if(data !== "error"){
          return res.status(200).json({ response: data });
        }
      }

      return res.status(500).json({ response: 'error' });
      
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

export default process.env.SENTRY_AUTH_TOKEN ? withSentry(teamInvoice) : teamInvoice;