import { manualCommissionCreate } from '@/utils/useDatabase';
import { withSentry } from '@sentry/nextjs';

const createCommission = async (req, res) => {
  if (req.method === 'POST') {
    const { referralReference } = req.body;

    try {
      const commission = await manualCommissionCreate(referralReference, {
        commission_sale_value: '10'
      });

      if (commission !== 'error') {
        return res.status(200).json({ response: commission });
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

export default process.env.SENTRY_AUTH_TOKEN
  ? withSentry(createCommission)
  : createCommission;
