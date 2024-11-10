import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "./AuthService";
import "../styles/Login.css";

const Register = () => {
  const [last_name, setLastName] = useState("");
  const [first_name, setFirstName] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    AuthService.register(
      username,
      email,
      password,
      first_name,
      last_name,
      history
    );
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Регистрация</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          className="login-input"
          placeholder="Имя"
          value={first_name}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          type="text"
          className="login-input"
          placeholder="Фамилия"
          value={last_name}
          onChange={(e) => setLastName(e.target.value)}
          required
        />

        <input
          type="text"
          className="login-input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
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
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
};

export default Register;
