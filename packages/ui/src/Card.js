export const Card = ({ children }) => {
  return(
    <div className="bg-white shadow-lg rounded-xl max-w-3xl border-4 border-gray-200">
      <div className="p-6 sm:p-8">
        {children}
      </div>
    </div>
  )
};

export default Card;