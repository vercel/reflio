import fetch from 'node-fetch';

export const getURL = () => {
  const url = process.env.NEXT_PUBLIC_SITE_URL ? process.env.NEXT_PUBLIC_SITE_URL : 'http://localhost:3000'
  return url.includes('http') ? url : `https://${url}`;
};

export const postData = async ({ url, token, data = {} }) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json', token }),
    credentials: 'same-origin',
    body: JSON.stringify(data)
  });

  if (res.error) {
    throw error;
  }

  return res.json();
};

export const UTCtoString = (date) => {
  return new Date(date).toISOString().split('T')[0];
};

export const checkUTCDateExpired = (UTCDate) => {
  let dateToday = new Date();
  let dateTodayTimestamp = dateToday.getTime();
  let UTCDateConverted = new Date(UTCDate);
  let UTCDateConvertedTimestamp = UTCDateConverted.getTime();

  if(dateTodayTimestamp > UTCDateConvertedTimestamp){
    return true;
  } else {
    return false;
  }
};

export const capitalizeString = (str) => {
  var firstLetter = str.substr(0, 1);
  return firstLetter.toUpperCase() + str.substr(1);
};

export const toDateTime = (secs) => {
  var t = new Date('1970-01-01T00:30:00Z'); // Unix epoch start.
  t.setSeconds(secs);
  return t;
};

export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

export const timeSince = (date) => {
  let seconds = Math.floor((new Date() - new Date(date).getTime()) / 1000);
  let interval = seconds / 31536000;

  if (interval > 1) {
    if(Math.floor(interval) === 1){
      return Math.floor(interval) + " year ago";
    } else {
      return Math.floor(interval) + " years ago";
    }
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    if(Math.floor(interval) === 1){
      return Math.floor(interval) + " month ago";
    } else {
      return Math.floor(interval) + " months ago";
    }
  }
  interval = seconds / 86400;
  if (interval > 1) {
    if(Math.floor(interval) === 1){
      return Math.floor(interval) + " day ago";
    } else {
      return Math.floor(interval) + " days ago";
    }
  }
  interval = seconds / 3600;
  if (interval > 1) {
    if(Math.floor(interval) === 1){
      return Math.floor(interval) + " hour ago";
    } else {
      return Math.floor(interval) + " hours ago";
    }
  }
  interval = seconds / 60;
  if (interval > 1) {
    if(Math.floor(interval) === 1){
      return Math.floor(interval) + " minute ago";
    } else {
      return Math.floor(interval) + " minutes ago";
    }
  }
  return Math.floor(seconds) + " seconds ago";
}

export const checkValidUrl = (str) => {
  let pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{1,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}

export const slugifyString = (text) => {
  return text
  .toString()
  .normalize('NFD')
  .replace( /[\u0300-\u036f]/g, '' )
  .toLowerCase()
  .trim()
  .replace(/\s+/g, '-')
  .replace(/[^\w\-]+/g, '')
  .replace(/\-\-+/g, '-')
  .substring(0, 64);
};

export const priceString = (price, currency) => {
  if(price === null || !currency) return "error";

  let string = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(price);

  return string;
}

export const priceStringDivided = (price, currency) => {
  if(price === null || !currency) return "error";

  let string = priceString(price/100, currency);

  return string;
}

export const monthsBetweenDates = (dt2, dt1) => {
  let diff =(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= (60 * 60 * 24 * 7 * 4);
  return Math.abs(Math.round(diff));
}

export const generateInviteUrl = (activeCampaign, companyHandle, campaignId) => {
  if(activeCampaign === true){
    return `${process.env.NEXT_PUBLIC_AFFILIATE_SITE_URL}/invite/${companyHandle}`;
  } else {
    return `${process.env.NEXT_PUBLIC_AFFILIATE_SITE_URL}/invite/${companyHandle}/${campaignId}`;
  }
};

export const LogSnagPost = async (type, message) => {
  try {
    if(process.env.NEXT_PUBLIC_LOGSNAG_TOKEN){
      let myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${process.env.NEXT_PUBLIC_LOGSNAG_TOKEN}`);
      myHeaders.append("Content-Type", "application/json");
    
      const project = "reflio";
      const fancyType = type.replace(/-/g, " ").toUpperCase(); 
    
      let emojiType = "🔥";
    
      if(type === "stripe-connected"){
        emojiType = "💳";
      } else if(type === "new-campaign"){
        emojiType = "📚";
      } else if(type === "invite-affiliate"){
        emojiType = "🧑";
      } else if(type === "referral-created"){
        emojiType = "🎉";
      } else if(type === "commission-created"){
        emojiType = "💵";
      }
    
      let raw = JSON.stringify({
        "project": project,
        "channel": type,
        "event": fancyType,
        "description": message,
        "icon": emojiType,
        "notify": true
      });
    
      let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
    
      await fetch("https://api.logsnag.com/v1/log", requestOptions)
        .then(response => response.text())
        .then(result => {return "success"})
        .catch(error => {return "error"});
    } else {
      return "LogSnag token not found in .env file";
    }
  } catch (error) {
    console.warn(error);
    return "error"
  }
};

export const prettyMonthStartAndEnd = () => {
  const date = new Date();
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });

  return {
    firstDay,
    lastDay
  }
}