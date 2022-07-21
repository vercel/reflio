const ReflioScript = async function() {
  const apiRoot = 'http://localhost:3000/api';
  const rootDomain = window.location.href;
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const reflioVerifyParam = urlParams.get("reflioVerify");
  const reflioReferralParam = urlParams.get("ref");
  let reflioReferralObject = localStorage.getItem('reflioReferral');
  const reflioScript = document.querySelector("script[data-reflio]");
  const reflioEvent = new CustomEvent("Reflio", {
    detail: {
      companyId: reflioScript.getAttribute("data-reflio"),
      window: window,
      rooyDomain: rootDomain,
      apiRoot: apiRoot
    }
  });  

  window.addEventListener("Reflio", function(e){
    console.log(e);
  });
  
  async function checkDomainVerification(){
    return await fetch(apiRoot+'/verify-company').then(function(response) {
      return response.json();
    });
  }

  //Tracking script verification from server 
  if(reflioVerifyParam !== null){
    if(reflioVerifyParam === "true"){
      const verifyDomain = await checkDomainVerification();

      if(verifyDomain?.verified === true){
        window.location.href = `http://localhost:3000/dashboard/${reflioEvent?.detail?.companyId}/setup/verify`
      }
    }
  }
  
  //WIP: add local storage item if referral is valid
  if(reflioReferralParam !== null && reflioReferralParam === "true" && reflioEvent?.detail?.companyId && reflioReferralObject === null){
    const verifyDomain = await checkDomainVerification();

    if(verifyDomain?.verified === true){
      await fetch(apiRoot+'/verify-company').then(function(response) {
        return response.json();
      });
    }
  }

  //WIP: track conversion from payment
  window.addEventListener("Reflio.convert", function(e){
    if(e?.detail?.email){
      console.log("Customer: ", e?.detail.email);
    }
  });

  if (reflioScript) {
    window.dispatchEvent(reflioEvent);
  } else {
    console.error("Could not load Reflio: make sure the <script> tag includes data-reflio='<companyId>'")
  }

}({});