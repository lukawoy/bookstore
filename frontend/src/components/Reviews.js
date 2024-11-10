import React, { useEffect, useState } from "react";
import { fetchReviews } from "../Api";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const loadReviews = async () => {
      const response = await fetchReviews();
      setReviews(response.data);
    };

    loadReviews();
  }, []);

  return (
    <div>
      <h1>Отзывы</h1>
      <ul>
        {reviews.map((review) => (
          <li key={review.id}>
            {review.book.title}: {review.rating} - {review.comment}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Reviews;
