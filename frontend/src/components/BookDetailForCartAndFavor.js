import React from "react";
import "../styles/styles.css";

const Book = ({
  title,
  author_last_name,
  author_first_name,
  author_middle_name,
  price,
  image,
}) => {
  let full_name_author;
  if (author_middle_name[0]) {
    full_name_author = (
      <p>
        <strong>Автор:</strong> {author_last_name} {author_first_name[0][0]}.{" "}
        {author_middle_name[0][0]}.
      </p>
    );
  } else {
    full_name_author = (
      <p>
        <strong>Автор:</strong> {author_last_name} {author_first_name[0][0]}.
      </p>
    );
  }

  return (
    <div className="book">
      <img src={image} alt={title} className="book-image" />
      <h2>{title}</h2>
      {full_name_author}
      <p>
        <strong>Цена:</strong> {price} руб.
      </p>
    </div>
  );
};

export default Book;
