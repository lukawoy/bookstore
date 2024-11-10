import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";
import AuthService from "./AuthService";
import { AuthContext } from "../context/auth-context";

const Header = () => {
  const { logout } = useContext(AuthContext);
  const isAuthenticated = AuthService.isAuthenticated();
  const handleLogout = () => {
    logout();
  };

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
