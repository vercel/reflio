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

export const lightOrDark = (color) => {
    // Variables for red, green, blue values
    var r, g, b, hsp;
    
    // Check the format of the color, HEX or RGB?
    if (color.match(/^rgb/)) {

        // If RGB --> store the red, green, blue values in separate variables
        color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
        
        r = color[1];
        g = color[2];
        b = color[3];
    } 
    else {
        
        // If hex --> Convert it to RGB: http://gist.github.com/983661
        color = +("0x" + color.slice(1).replace( 
        color.length < 5 && /./g, '$&$&'));

        r = color >> 16;
        g = color >> 8 & 255;
        b = color & 255;
    }
    
    // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
    hsp = Math.sqrt(
    0.299 * (r * r) +
    0.587 * (g * g) +
    0.114 * (b * b)
    );

    // Using the HSP value, determine whether the color is light or dark
    if (hsp>160) {

        return 'light';
    } 
    else {

        return 'dark';
    }
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

export const checkValidEmail = (address) => {
  return !! address.match(/.+@.+/);
}

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