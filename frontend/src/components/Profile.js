import React, { useEffect, useState } from "react";
import AuthService from "./AuthService";
import "../styles/Profile.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchResetEmail, fetchResetPassword, fetchDeleteUser } from "../Api";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showDeleteUserForm, setShowDeleteUserForm] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userData = await AuthService.getUserProfile();
      if (userData) {
        setUser(userData);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEmailChange = async (e) => {
    e.preventDefault();
    const token = AuthService.getAccessToken();
    if (user.email === newEmail) {
      toast.warn(`Новый email должен отличаться от текущего ${user.email}`);
      return;
    }
    try {
      await fetchResetEmail(
        {
          new_email: newEmail,
          current_password: password,
        },
        { headers: { Authorization: token } }
      );
      toast.success("Email успешно изменен!");
      setNewEmail("");
      setPassword("");
    } catch (err) {
      toast.warn(`Ошибка: ${err.message}`);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const token = AuthService.getAccessToken();
    if (newPassword === password) {
      toast.warn(`Новый пароль должен отличаться от текущего!`);
      return;
    }
    try {
      await fetchResetPassword(
        {
          new_password: newPassword,
          current_password: password,
        },
        { headers: { Authorization: token } }
      );
      toast.success("Пароль успешно изменен!");
      setPassword("");
      setNewPassword("");
    } catch (err) {
      toast.warn(`Ошибка: ${err.message}`);
    }
  };

  const handleDeleteUser = async (e) => {
    e.preventDefault();
    const token = AuthService.getAccessToken();
    try {
      await fetchDeleteUser(
        {
          current_password: password,
        },
        { headers: { Authorization: token } }
      );
      window.location.reload();
    } catch (err) {
      toast.warn(`Ошибка: ${err.message}`);
    }
  };

  if (!user) {
    return <div>Загрузка профиля...</div>;
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
        <h1>Профиль</h1>
      </div>
      <div>
        <p>Имя: {user.first_name}</p>
        <p>Фамилия: {user.last_name}</p>
        <p>Email: {user.email}</p>
      </div>

      <div>
        <button onClick={() => setShowEmailForm(!showEmailForm)}>
          {showEmailForm ? "Скрыть форму" : "Изменить email"}
        </button>
        {showEmailForm && (
          <form onSubmit={handleEmailChange}>
            <input
              type="email"
              placeholder="Введите новый email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Введите текущий пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Сменить email</button>
          </form>
        )}
      </div>

      <div>
        <button onClick={() => setShowPasswordForm(!showPasswordForm)}>
          {showPasswordForm ? "Скрыть форму" : "Изменить пароль"}
        </button>
        {showPasswordForm && (
          <form onSubmit={handlePasswordChange}>
            <input
              type="password"
              placeholder="Текущий пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Новый пароль"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button type="submit">Сменить пароль</button>
          </form>
        )}
      </div>

      <div>
        <button onClick={() => setShowDeleteUserForm(!showDeleteUserForm)}>
          {showDeleteUserForm ? "Скрыть форму" : "Удалить аккаунт"}
        </button>
        {showDeleteUserForm && (
          <form onSubmit={handleDeleteUser}>
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Удалить аккаунт</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
