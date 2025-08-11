import './StarRating.css';

const StarRating = ({ rating }) => {
  const stars = [1, 2, 3, 4, 5];
  
  // Get the integer part of the rating (e.g., from 3.5, get 3)
  const filledStars = Math.floor(rating);
  
  // Check if there is a decimal part for the half star
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="star-rating">
      {stars.map((star, index) => {
        if (index < filledStars) {
          return <span key={index} className="star star-filled">★</span>;
        } else if (index === filledStars && hasHalfStar) {
          return <span key={index} className="star star-half">★</span>;
        } else {
          return <span key={index} className="star star-empty">☆</span>;
        }
      })}
    </div>
  );
};

export default StarRating;