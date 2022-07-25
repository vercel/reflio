export default function emailBuilderInner(parsedDoc, type, subject, content, settings) {
  if(parsedDoc === null) return false;
  
  let templateEmail = parsedDoc.serialize(parsedDoc);

  if(type === 'invite'){
    templateEmail = templateEmail.replace(/{{subject}}/g, subject);
    templateEmail = templateEmail.replace(/{{content}}/g, content);
    templateEmail = templateEmail.replace(/{{inviteURL}}/g, `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`);
  }


  return templateEmail;
}