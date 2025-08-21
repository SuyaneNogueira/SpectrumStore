import React, { useState, useEffect } from 'react';
import './Radio.css';

const Radio = ({ initialRating, onRatingChange }) => {
  const [rating, setRating] = useState(initialRating);

  // Use useEffect para atualizar o estado interno caso a prop `initialRating` mude
  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  const handleRatingChange = (event) => {
    const newRating = parseInt(event.target.value, 10);
    setRating(newRating);
    // Chama a função de callback, se fornecida, para passar o novo rating para o componente pai
    if (onRatingChange) {
      onRatingChange(newRating);
    }
  };

  return (
    <div className="rating">
      {[5, 4, 3, 2, 1].map((starValue) => (
        <React.Fragment key={starValue}>
          <input
            defaultValue={starValue}
            name="rating-radio" 
            id={`star${starValue}`}
            type="radio"
            checked={rating === starValue}
            onChange={handleRatingChange}
          />
          <label title={`${starValue} Estrelas`} htmlFor={`star${starValue}`} />
        </React.Fragment>
      ))}
    </div>
  );
};

export default Radio;