import { useEffect } from 'react';
import { SEOMeta } from '@/templates/SEOMeta'; 

export const Commercial = () => {

  useEffect(() => {
    const el = document.createElement('script')
    el.src = 'https://embed.reform.app/v1/embed.js'
    document.head.appendChild(el);

    el.onload = () => {
      if(typeof window.Reform !== 'undefined'){
        window.Reform('init', {
          url: 'https://forms.reform.app/45Dbqq/commercial/b04o3s',
          target: '#my-reform',
        })
      }
    }
  }, [])

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

export default Commercial;