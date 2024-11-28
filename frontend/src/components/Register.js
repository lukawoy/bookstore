import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "./AuthService";
import "../styles/Login.css";

const Register = () => {
  const [last_name, setLastName] = useState("");
  const [first_name, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const history = useNavigate();

  const validatePassword = (password) => {
    const errors = {};
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*]/.test(password);

    if (password.length < minLength) {
      errors.length = `Пароль должен содержать не менее ${minLength} символов.`;
    }
    if (!hasUpperCase) {
      errors.uppercase =
        "Пароль должен содержать хотя бы одну заглавную букву.";
    }
    if (!hasLowerCase) {
      errors.lowercase = "Пароль должен содержать хотя бы одну строчную букву.";
    }
    if (!hasNumbers) {
      errors.numbers = "Пароль должен содержать хотя бы одну цифру.";
    }
    if (!hasSpecialChars) {
      errors.specialChars =
        "Пароль должен содержать хотя бы один специальный символ.";
    }

    return errors;
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const passwordErrors = validatePassword(password);
    const confirmPasswordError =
      password !== confirmPassword ? "Пароли не совпадают." : "";

    if (Object.keys(passwordErrors).length === 0 && !confirmPasswordError) {
      AuthService.register(email, password, first_name, last_name, history);
    } else {
      setErrors({ ...passwordErrors, confirmPassword: confirmPasswordError });
    }
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
        {errors.length && <p style={{ color: "red" }}>{errors.length}</p>}
        {errors.uppercase && <p style={{ color: "red" }}>{errors.uppercase}</p>}
        {errors.lowercase && <p style={{ color: "red" }}>{errors.lowercase}</p>}
        {errors.numbers && <p style={{ color: "red" }}>{errors.numbers}</p>}
        {errors.specialChars && (
          <p style={{ color: "red" }}>{errors.specialChars}</p>
        )}

        <input
          type="password"
          className="login-input"
          placeholder="Repeat the password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {errors.confirmPassword && (
          <p style={{ color: "red" }}>{errors.confirmPassword}</p>
        )}

        <button type="submit" className="login-submit">
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
};

export default Register;
