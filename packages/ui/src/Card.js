export const Card = (props) => {

  let styles = 'shadow-lg rounded-xl max-w-3xl border-4';

  if(props.secondary){
    styles = styles + ' bg-secondary border-secondary-2';
  } else {
    styles = styles + ' bg-white border-gray-200';
  }

  return(
    <div className={styles}>
      <div className="p-6 sm:p-8">
        {props.children}
      </div>
    </div>
  )
};

export default Card;