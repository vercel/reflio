import emailBuilderServer from '@/utils/email-builder-server';

export const sendEmail = async (subject, content, to, type, settings) => {
  const SibApiV3Sdk = require('sib-api-v3-sdk');
  let defaultClient = SibApiV3Sdk.ApiClient.instance;
  let apiKey = defaultClient.authentications['api-key'];
  apiKey.apiKey = process.env.SIB_API_KEY;
  let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  const emailHtml = emailBuilderServer(type, subject, content, settings);
  
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = emailHtml;
  sendSmtpEmail.sender = {"name": settings, "email":"affiliate@reflio.com"};
  sendSmtpEmail.to = [{"email": to}];

  if(type === 'invite'){    
    sendSmtpEmail.params = {"parameter":"AffiliateInvite","subject":"AffiliateInvite"};
  }
  
  apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data) {
    console.log('running email')
    console.log(data)
    return "success";
  }, function(error) {
    console.log(error);
    return "error";
  });

  return "success";
};
