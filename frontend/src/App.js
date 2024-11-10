import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import BookList from "./components/BookList";
import Login from "./components/Login";
import Register from "./components/Register";
import Cart from "./components/Cart"; // Добавьте позже
import Favorites from "./components/Favorites"; // Добавьте позже
import Reviews from "./components/Reviews"; // Добавьте позже

import Footer from "./components/Footer";
import Header from "./components/Header";
import Profile from "./components/Profile";
import BookCard from "./components/BookCard";

const App = () => {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route exact path="/" element={<BookList />} />
          <Route path="/auth/jwt/create" element={<Login />} />
          <Route path="/users" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/books/:bookId" element={<BookCard />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
