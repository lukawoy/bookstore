import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthService from "./AuthService";
import Book from "./BookDetailForCartAndFavor";
import "../styles/styles.css";
import { fetchMyFavorite, fetchDeleteFavorite } from "../Api";
import { Link } from "react-router-dom";

const Favorites = () => {
  const [favorItems, setFavorItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState(5);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const fetchFavorItems = async () => {
      const token = AuthService.getAccessToken();

      try {
        const response = await fetchMyFavorite(
          { headers: { Authorization: token } },
          limit,
          offset
        );
        setFavorItems(response.data.results);
        setCount(response.data.count);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorItems();
  }, [limit, offset]);

  const handleNextPage = () => {
    setOffset((prevOffset) => prevOffset + limit);
  };
  const handlePreviousPage = () => {
    setOffset((prevOffset) => Math.max(prevOffset - limit, 0));
  };

  const handleRemoveFromFavor = async (bookId, favoId) => {
    const token = AuthService.getAccessToken();

    try {
      await fetchDeleteFavorite({ headers: { Authorization: token } }, bookId);
      setFavorItems((prevItems) =>
        prevItems.filter((item) => item.id !== favoId)
      );
      toast.success("Книга удалена из избранного!");
    } catch (err) {
      setError(err.message);
      toast.warn(`Ошибка: ${err.message}`);
    }
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  return (
    <div className="container">
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        closeOnClick
        pauseOnFocusLoss={false}
        pauseOnHover={false}
      />
      <h1 className="header">Избранное</h1>
      {favorItems.length === 0 ? (
        <p>В избранном ничего нет.</p>
      ) : (
        <div className="grid-container">
          {favorItems.map((book) => (
            <div key={book.id} className="book-card">
              <div className="grid-item">
                <Link to={`/books/${book.book_id}`} className="no-underline">
                  <h2>{book.title}</h2>
                </Link>
                <Book
                  author_last_name={book.author.map(
                    (author) => author.last_name
                  )}
                  author_first_name={book.author.map(
                    (author) => author.first_name
                  )}
                  author_middle_name={book.author.map(
                    (author) => author.middle_name
                  )}
                  image={book.image}
                  price={book.price}
                />
                <button
                  onClick={() => handleRemoveFromFavor(book.book_id, book.id)}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={offset === 0}>
          Предыдущая
        </button>
        <button onClick={handleNextPage} disabled={offset + limit >= count}>
          Следующая
        </button>
      </div>
      <p>
        Показано {offset + 1} - {Math.min(offset + limit, count)} из {count}
      </p>
    </div>
  );
};

export default Favorites;
