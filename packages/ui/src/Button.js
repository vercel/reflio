import dynamic from 'next/dynamic';

export const Button = (props) => {
  const Link = dynamic(() => import('next/link'));

  let styles = 'relative inline-flex items-center justify-center border-2 border-transparent font-semibold rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all';

  //Sizing styles
  if(props.small){
    styles = styles + ' px-4 py-2 text-sm md:text-base'
  } else if(props.xsmall){
    styles = styles + ' px-4 py-2 text-sm md:text-xs'
  } else if(props.medium){
    styles = styles + ' px-6 py-3 text-sm md:text-lg'
  } else if(props.xlarge){
    styles = styles + ' px-8 py-4 text-sm md:text-2xl'
  } else {
    styles = styles + ' px-8 py-3 text-sm md:text-xl'
  }

  //Color styles
  if(props.secondary){
    styles = styles + ' text-white bg-secondary border-secondary-2 hover:bg-secondary-2'
  } else if(props.gray){
    styles = styles + ' text-gray-800 bg-gray-300 border-gray-400 hover:bg-gray-400'
  } else if(props.white){
    styles = styles + ' bg-white border-gray-100 hover:bg-gray-100'
  } else if(props.red){
    styles = styles + ' text-white bg-red-500 border-red-600 hover:bg-red-600'
  } else {
    styles = styles + ' bg-primary border-primary-2 hover:bg-primary-2'
  }

  if(props.mobileFull){
    styles = styles + ' w-full sm:w-auto x'
  }

  if(props.href){
    return(
      <Link
        passHref
        href={props.href}
      >
        <a 
          className={`${styles} ${props.className ? props.className : ''}`}
          onClick={props.onClick && props.onClick}
          target={props.external ? '_blank' : ''}
        >
          {props.children && props.children}
        </a>    
      </Link>
    )
  } else {
    return(
      <button 
        disabled={props.disabled && props.disabled}
        onClick={props.onClick && props.onClick}
        className={`${styles} ${props.className ? props.className : ''}`}
      >
        {props.children && props.children}
      </button>
    )
  }
};

export default Button;