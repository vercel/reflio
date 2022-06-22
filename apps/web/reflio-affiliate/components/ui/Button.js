const Button = (props) => {
  const ButtonType = props.href ? `a` : `button`;
  let styles = 'relative inline-flex items-center border-2 border-transparent font-semibold rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all';

  //Sizing styles

  if(props.xsmall){
    styles = styles + ' px-4 py-1.5 text-xs'
  } else if(props.small){
    styles = styles + ' px-4 py-2 text-xs md:text-lg'
  } else if(props.medium){
    styles = styles + ' px-5 py-3 text-xs md:text-lg'
  } else {
    styles = styles + ' px-8 py-3 text-xs md:text-lg'
  }

  //Color styles
  if(props.secondary){
    styles = styles + ' text-white bg-secondary border-secondary-2 hover:bg-secondary-2'
  } else {
    styles = styles + ' bg-primary border-primary-2 hover:bg-primary-2'
  }

  return(
    <ButtonType 
      disabled={props.disabled && props.disabled}
      onClick={props.onClick && props.onClick}
      href={props.href && props.href}
      className={`${styles} ${props.className ? props.className : ''}`}
    >
      {props.children && props.children}
    </ButtonType>
  )
}

export default Button;