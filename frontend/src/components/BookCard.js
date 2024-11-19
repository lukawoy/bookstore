import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AuthService from "./AuthService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/BookCard.css";
import "../styles/Reviews.css";
import {
  fetchOneBook,
  fetchBookReviews,
  fetchAddReviews,
  fetchEditReviews,
  fetchDeleteReviews,
  fetchAddCard,
  fetchAddFavorite,
} from "../Api";
import { Link } from "react-router-dom";

const BookCard = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [book_author_name, setAuthorName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewScore, setNewReviewScore] = useState(1);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editingReviewText, setEditingReviewText] = useState("");
  const [editingReviewScore, setEditingReviewScore] = useState(1);
  const [username, setUsername] = useState("");
  const isAuthenticated = AuthService.isAuthenticated();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetchOneBook(bookId);
        setBook(response.data);
        setAuthorName(
          `${response.data.author.map((author) => author.last_name)} 
                ${response.data.author.map((author) => author.first_name)} 
                ${response.data.author.map((author) => author.middle_name)}`
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    const fetchReviews = async () => {
      try {
        const response = await fetchBookReviews(bookId);
        setReviews(response.data.results);
      } catch (err) {
        setError(err.message);
      }
    };
    const fetchUserProfile = async () => {
      const userData = await AuthService.getUserProfile();
      if (isAuthenticated && userData) {
        setUsername(userData.username);
      }
    };

    fetchBook();
    fetchReviews();
    fetchUserProfile();
  }, [bookId]);

  const handleAddReview = async (event) => {
    event.preventDefault();
    try {
      const token = AuthService.getAccessToken();
      const response = await fetchAddReviews(
        {
          text: newReviewText,
          score: newReviewScore,
        },
        bookId,
        { headers: { Authorization: token } }
      );
      setReviews([...reviews, response.data]);
      setNewReviewText("");
      setNewReviewScore(1);
      toast.success("Отзыв добавлен.");
    } catch (err) {
      if (err.response && err.response.status === 400) {
        toast.warn("Возникла ошибка! Возможно Вы уже добавили свой отзыв!");
      } else {
        setError(err.message);
        toast.warn(`Ошибка: ${err.message}`);
      }
    }
  };

  const handleEditReview = async (reviewId) => {
    const token = AuthService.getAccessToken();
    try {
      const response = await fetchEditReviews(
        {
          text: editingReviewText,
          score: editingReviewScore,
        },
        bookId,
        reviewId,
        { headers: { Authorization: token } }
      );
      setReviews(
        reviews.map((review) =>
          review.id === reviewId ? response.data : review
        )
      );
      setEditingReviewId(null);
      setEditingReviewText("");
      setEditingReviewScore(1);
      toast.success("Отзыв отредактирован.");
    } catch (err) {
      if (err.response && err.response.status === 403) {
        toast.warn("Нельзя редактировать чужой отзыв!");
      } else {
        setError(err.message);
        toast.warn(`Ошибка: ${err.message}`);
      }
    }
  };
  const handleDeleteReview = async (reviewId) => {
    const token = AuthService.getAccessToken();
    try {
      await fetchDeleteReviews(
        { headers: { Authorization: token } },
        bookId,
        reviewId
      );
      setReviews(reviews.filter((review) => review.id !== reviewId));
      toast.success("Ваш отзыв удален!");
    } catch (err) {
      if (err.response && err.response.status === 403) {
        toast.warn("Нельзя удалять чужой отзыв!");
      } else {
        setError(err.message);
        toast.warn(`Ошибка: ${err.message}`);
      }
    }
  };

  const handleAddToCart = async (bookId) => {
    const token = AuthService.getAccessToken();

    try {
      await fetchAddCard({}, bookId, { headers: { Authorization: token } });
      toast.success("Книга добавлена в корзину!");
    } catch (err) {
      if (err.response && err.response.status === 400) {
        toast.warn("Эта книга уже добавлена в корзину.");
      } else {
        toast.warn(`Ошибка: ${err.message}`);
      }
    }
  };

  const handleAddToFavorite = async (bookId) => {
    const token = AuthService.getAccessToken();

    try {
      await fetchAddFavorite({}, bookId, { headers: { Authorization: token } });
      toast.success("Книга добавлена в избранное!");
    } catch (err) {
      if (err.response && err.response.status === 400) {
        toast.warn("Эта книга уже добавлена в избранное.");
      } else {
        toast.warn(`Ошибка: ${err.message}`);
      }
    }
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  if (!book) {
    return <div>Книга не найдена.</div>;
  }

  return (
    <div className="book-card-single">
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        closeOnClick
        pauseOnFocusLoss={false}
        pauseOnHover={false}
      />
      <img src={book.image} alt={book.title} className="book-image" />
      <h3 className="book-title">{book.title}</h3>
      <p className="book-author">
        <strong>Автор:</strong> {book_author_name}
      </p>
      <p>
        <strong>Описание:</strong> {book.description}
      </p>
      <p>
        <strong>Дата публикации:</strong> {book.release_date}
      </p>
      <p className="book-price">
        <strong>Цена:</strong> {book.price} ₽
      </p>
      <p>
        <strong>Количество отзывов:</strong> {book.number_reviews}
      </p>
      <p>
        <strong>Рейтинг:</strong> {book.rating}
      </p>

      <div>
        {isAuthenticated ? (
          <div>
            <button onClick={() => handleAddToCart(book.id)}>
              Добавить в корзину
            </button>
            <button onClick={() => handleAddToFavorite(book.id)}>
              Добавить в избранное
            </button>
          </div>
        ) : (
          <div></div>
        )}
      </div>

      <h3>Отзывы</h3>
      <ul className="reviews-container">
        {reviews.map((review) => (
          <div key={review.id} className="review">
            {editingReviewId === review.id ? (
              <div>
                <textarea
                  className="review-input"
                  type="text"
                  value={editingReviewText}
                  onChange={(e) => setEditingReviewText(e.target.value)}
                  placeholder="Введите новый текст отзыва"
                  required
                />

                <input
                  type="number"
                  value={editingReviewScore}
                  min="1"
                  max="10"
                  onChange={(e) =>
                    setEditingReviewScore(Number(e.target.value))
                  }
                />
                <button onClick={() => handleEditReview(review.id)}>
                  Сохранить
                </button>
                <button onClick={() => setEditingReviewId(null)}>Отмена</button>
              </div>
            ) : (
              <div>
                <p className="review-author">
                  Автор отзыва: {review.author_review.username}. Оценка:{" "}
                  {review.score} ★
                </p>
                <p className="review-text">{review.text}</p>
                {review.author_review.username === username && (
                  <div>
                    <button
                      onClick={() => {
                        setEditingReviewId(review.id);
                        setEditingReviewText(review.text);
                        setEditingReviewScore(review.score);
                      }}
                    >
                      Редактировать
                    </button>
                    <button onClick={() => handleDeleteReview(review.id)}>
                      Удалить
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </ul>
      <div>
        {isAuthenticated ? (
          <div className="review-input-container">
            <h3>Оставить отзыв</h3>
            <form onSubmit={handleAddReview}>
              <textarea
                className="review-input"
                type="text"
                value={newReviewText}
                onChange={(e) => setNewReviewText(e.target.value)}
                placeholder="Введите текст отзыва"
                required
              />
              <div>
                <label>Оценка: </label>
                <select
                  value={newReviewScore}
                  onChange={(e) => setNewReviewScore(Number(e.target.value))}
                >
                  <option value="1">1 ★</option>
                  <option value="2">2 ★</option>
                  <option value="3">3 ★</option>
                  <option value="4">4 ★</option>
                  <option value="5">5 ★</option>
                  <option value="6">6 ★</option>
                  <option value="7">7 ★</option>
                  <option value="8">8 ★</option>
                  <option value="9">9 ★</option>
                  <option value="10">10 ★</option>
                </select>
              </div>
              <button type="submit" className="review-submit">
                Отправить
              </button>
            </form>
          </div>
        ) : (
          <Link to={"/auth/jwt/create/"} className="no-underline">
            <h3>Авторизуйтесь, чтобы оставить отзыв.</h3>
          </Link>
        )}
      </div>
    </div>
  );
};

export default BookCard;
