import { useEffect } from 'react';
import { SEOMeta } from '@/templates/SEOMeta'; 

export const Terms = () => {

  useEffect(() => {
    window.Reform=window.Reform||function(){(Reform.q=Reform.q||[]).push(arguments)};
    const script = document.createElement('script');
    script.src = "https://embed.reform.app/v1/embed.js";
    script.async = true;
    document.body.appendChild(script);
    Reform('init', {
        url: 'https://forms.reform.app/45Dbqq/commercial/b04o3s',
        target: '#my-reform',
        background: 'transparent',
    })
              
  });

  return(
    <>
      <SEOMeta title="Commercial"/>
      <div className="content-block">
          <div className="max-w-5xl mx-auto px-6">
            <div>
              <div id="my-reform"></div>
            </div>
          </div>
      </div>
    </>
  );
};

export default Terms;