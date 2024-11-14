import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";
import AuthService from "./AuthService";
import { AuthContext } from "../context/auth-context";
import { fetchMyFavorite } from "../Api";

const Header = () => {
  const [previousReviewCounts, setPreviousReviewCounts] = useState(new Map()); // Хранит количество отзывов для каждой книги
  const [favoriteBooks, setFavoriteBooks] = useState([]); // Состояние для хранения избранных книг
  const [newReviews, setNewReviews] = useState(false); // Состояние для отслеживания новых отзывов

  const { logout } = useContext(AuthContext);
  const isAuthenticated = AuthService.isAuthenticated();
  const handleLogout = () => {
    logout();
  };

  const checkForNewReviews = () => {
    let newReviewsExist = false;
    const updatedPreviousReviewCounts = new Map(previousReviewCounts);

    favoriteBooks.forEach((book) => {
      const currentReviewCount = book.number_reviews || 0; // Текущее количество отзывов
      const previousReviewCount = updatedPreviousReviewCounts.get(book.id) || 0; // Предыдущее количество отзывов

      if (currentReviewCount > previousReviewCount) {
        newReviewsExist = true;
      }

      updatedPreviousReviewCounts.set(book.id, currentReviewCount);
    });

    if (newReviewsExist) {
      setNewReviews(true);
    }

    localStorage.setItem(
      "previousReviewCounts",
      JSON.stringify(Array.from(updatedPreviousReviewCounts))
    );
    setPreviousReviewCounts(updatedPreviousReviewCounts);
  };

  const handleNewReviews = () => {
    setNewReviews(false);
  };

  const fetchFavoriteBooks = async () => {
    const token = AuthService.getAccessToken();

    try {
      const response = await fetchMyFavorite({
        headers: { Authorization: token },
      });
      setFavoriteBooks(response.data.results);
    } catch (err) {
      if (err.response && err.response.status === 400) {
      }
    }
  };

  useEffect(() => {
    fetchFavoriteBooks();
  }, []);

  useEffect(() => {
    const savedCounts = localStorage.getItem("previousReviewCounts");

    if (savedCounts) {
      const countsMap = new Map(JSON.parse(savedCounts));
      setPreviousReviewCounts(countsMap);
    }
  }, []);

  useEffect(() => {
    if (favoriteBooks.length > 0) {
      checkForNewReviews();
    }
  }, [favoriteBooks]);

  return (
    <header className="header">
      <Link to="/" className="no-underline">
        <h1>Bookstore</h1>
      </Link>

      <nav>
        <ul>
          <li>
            <Link to="/">На главную</Link>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <Link to="/cart">Корзина</Link>
              </li>
              <li>
                <Link to="/favorites">Избранное</Link>
                {newReviews && (
                  <div
                    onClick={handleNewReviews}
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      backgroundColor: "red",
                      cursor: "pointer",
                      position: "relative",
                      // top: '20px',
                      // right: '50px',
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    !
                  </div>
                )}
              </li>
              <li>
                <Link to="/profile">Профиль</Link>
              </li>
              <li>
                <button onClick={handleLogout}>Выйти</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/auth/jwt/create">Войти</Link>
              </li>
              <li>
                <Link to="/users">Регистрация</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
