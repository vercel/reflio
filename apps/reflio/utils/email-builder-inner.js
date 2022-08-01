export default function emailBuilderInner(parsedDoc, type, logoUrl, subject, content, settings, campaignId, companyHandle) {
  if(parsedDoc === null) return false;
  
  if(logoUrl === null){
    logoUrl = 'https://reflio.com/reflio-logo.png';
  }

  let templateEmail = parsedDoc.serialize(parsedDoc);

  if(type === 'invite'){
    templateEmail = templateEmail.replace(/{{logoUrl}}/g, logoUrl);
    templateEmail = templateEmail.replace(/{{subject}}/g, subject);
    templateEmail = templateEmail.replace(/{{content}}/g, content);
    templateEmail = templateEmail.replace(/{{inviteURL}}/g, `${process.env.NEXT_PUBLIC_AFFILIATE_SITE_URL}/signup`);
  }


  return templateEmail;
}