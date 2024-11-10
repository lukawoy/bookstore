import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthService from "./AuthService";
import Book from "./BookDetailForCartAndFavor";
import "../styles/styles.css";
import { fetchCard, fetchDeleteCard } from "../Api";
import { Link } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState(5);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const fetchCartItems = async () => {
      const token = AuthService.getAccessToken();

      try {
        const response = await fetchCard(
          { headers: { Authorization: token } },
          limit,
          offset
        );
        setCartItems(response.data.results);
        setCount(response.data.count);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [limit, offset]);

  const handleNextPage = () => {
    setOffset((prevOffset) => prevOffset + limit);
  };
  const handlePreviousPage = () => {
    setOffset((prevOffset) => Math.max(prevOffset - limit, 0));
  };

  const handleRemoveFromCart = async (bookId, itemId) => {
    const token = AuthService.getAccessToken();

    try {
      await fetchDeleteCard({ headers: { Authorization: token } }, bookId);
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id !== itemId)
      );
      toast.success("Книга удалена из корзины!");
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
      <h1 className="header">Корзина</h1>
      {cartItems.length === 0 ? (
        <p>Корзина пуста.</p>
      ) : (
        <div className="grid-container">
          {cartItems.map((book) => (
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
                  onClick={() => handleRemoveFromCart(book.book_id, book.id)}
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

export default Cart;
