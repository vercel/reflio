import emailBuilderInner from './email-builder-inner';

export default function emailBuilderServer(type, logoUrl, subject, content, settings, campaignId, companyHandle) {
  let emailType = 'default';

  if(type === 'invite'){
    emailType = 'inviteAffiliate';
  }

  const defaultEmail = require(`@/components/emails/${emailType}.js`).default;
  let templateEmail = defaultEmail();
  const jsdom = require("jsdom").JSDOM;
  const parsedDoc = new jsdom(templateEmail);

  return emailBuilderInner(parsedDoc, type, logoUrl, subject, content, settings, campaignId, companyHandle);
}