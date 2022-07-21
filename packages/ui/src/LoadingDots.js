export const LoadingDots = () => {
  return (
    <svg
      className="w-10 h-auto animate-pulse-fast"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 236 197"
    >
      <path
        fill="#e8e8e8"
        d="M171.453 0l39.682 39.46c32.789 32.607 32.789 85.473 0 118.08L171.453 197l-99.05-98.5L171.452 0z"
      ></path>
      <path
        fill="#cfcfcf"
        d="M64.273 197l-39.68-39.461c-32.79-32.606-32.79-85.472 0-118.078L64.273 0l99.053 98.5L64.274 197z"
      ></path>
      <path
        fill="#ababab"
        fillRule="evenodd"
        d="M117.863 53.297l45.462 45.208-45.462 45.209-45.46-45.209 45.46-45.208z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
};

export default LoadingDots;