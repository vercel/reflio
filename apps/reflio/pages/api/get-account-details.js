import { stripe } from '@/utils/stripe';

const getAccountDetails = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const account = await stripe.accounts.retrieve({
        stripeAccount: req.body.accountId
      });

      return res.status(200).json({ data: account });
    } catch (err) {
      // console.log(err);
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export default getAccountDetails;