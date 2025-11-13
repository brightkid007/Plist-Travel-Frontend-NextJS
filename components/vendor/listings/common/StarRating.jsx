const StarRating = ({ value = 0, onChange, className = "" }) => {
  const handleClick = (rating) => {
    if (onChange) {
      onChange(rating);
    }
  };

  return (
    <div className={`d-flex items-center gap-1 ${className}`}>
      {Array(5)
        .fill(null)
        .map((_, index) => {
          const rating = index + 1;
          const isSelected = value && rating <= value;
          return (
            <span
              key={index}
              className="text-20 text-yellow-1 lh-14 cursor-pointer"
              onClick={() => handleClick(rating)}
            >
              {isSelected ? "★" : "☆"}
            </span>
          );
        })}
    </div>
  );
};

export default StarRating;

