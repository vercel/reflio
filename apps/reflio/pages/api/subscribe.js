import { withSentry } from '@sentry/nextjs';

const emailSubscribe = async (req, res) => {
  if(!req.body.email) return false;
  
  if (req.method === 'POST') {
    const MailerLite = require('mailerlite-api-v2-node').default
    const mailerLite = MailerLite(process.env.MAILERLITE_KEY)
    const email = req.body.email;

    try {
      const result = await mailerLite.addSubscriber({email: email})

      return res.status(200).json({ result });

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

export default process.env.SENTRY_AUTH_TOKEN ? withSentry(emailSubscribe) : emailSubscribe;