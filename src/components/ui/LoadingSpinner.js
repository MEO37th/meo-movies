const LoadingSpinner = ({ size = "large", text = "Loading..." }) => {
  const sizeClasses = {
    small: "h-6 w-6",
    medium: "h-8 w-8",
    large: "h-12 w-12",
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      <div className={`animate-spin rounded-full border-t-2 border-b-2 border-red-500 ${sizeClasses[size]}`}></div>
      {text && <p className="mt-4 text-gray-400">{text}</p>}
    </div>
  )
}

export default LoadingSpinner
