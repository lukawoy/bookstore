import React, { useEffect, useState } from "react";
import { fetchBooks, fetchAddCard, fetchAddFavorite } from "../Api";
import Book from "./BookDetail";
import AuthService from "./AuthService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import "../styles/styles.css";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [inputSearchTerm, setInputSearchTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState(5);
  const [offset, setOffset] = useState(0);
  const isAuthenticated = AuthService.isAuthenticated();

  const extractBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchBooks(
        limit,
        offset,
        encodeURIComponent(searchTerm)
      );
      setBooks(response.data.results);
      setCount(response.data.count);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    extractBooks();
  }, [offset, searchTerm]);

  const handleInputChange = (event) => {
    setInputSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setSearchTerm(inputSearchTerm);
    setOffset(0);
  };

  const handleNextPage = () => {
    setOffset((prevOffset) => prevOffset + limit);
  };
  const handlePreviousPage = () => {
    setOffset((prevOffset) => Math.max(prevOffset - limit, 0));
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
        setError(err.message);
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
        setError(err.message);
      }
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
      <div className="header">
        <h1>Список книг</h1>

        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Поиск по названию книги..."
            value={inputSearchTerm}
            onChange={handleInputChange}
          />
          <button type="submit">Поиск</button>
        </form>
      </div>

      <div className="grid-container">
        {books.length > 0 ? (
          books.map((book) => (
            <div key={book.id} className="book-card">
              <div className="grid-item">
                <Link to={`/books/${book.id}`} className="no-underline">
                  <h2>{book.title}</h2>
                </Link>
                <Book
                  image={book.image}
                  author_last_name={book.author.map(
                    (author) => author.last_name
                  )}
                  author_first_name={book.author.map(
                    (author) => author.first_name
                  )}
                  author_middle_name={book.author.map(
                    (author) => author.middle_name
                  )}
                  releaseDate={book.release_date}
                  description={book.description}
                  price={book.price}
                  rating={book.rating}
                />

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
              </div>
            </div>
          ))
        ) : (
          <h1>Книги не найдены</h1>
        )}
      </div>
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

export default BookList;
