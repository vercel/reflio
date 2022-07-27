import emailBuilderInner from './email-builder-inner';

export default function emailBuilderServer(type, subject, content, settings) {
  let emailType = 'default';

  if(type === 'invite'){
    emailType = 'inviteAffiliate';
  }

  const defaultEmail = require(`@/components/emails/${emailType}.js`).default;
  let templateEmail = defaultEmail();
  const jsdom = require("jsdom").JSDOM;
  const parsedDoc = new jsdom(templateEmail);

  return emailBuilderInner(parsedDoc, type, subject, content, settings);
}