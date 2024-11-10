import React, { useState } from "react";
import AuthService from "./AuthService";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    AuthService.login(email, password, history);
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Вход</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          className="login-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="login-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="login-submit">
          Войти
        </button>
      </form>
      <div className="login-footer">
        <p>
          Нет аккаунта? <a href="/users">Зарегистрироваться</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
