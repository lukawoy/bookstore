import React from "react";
import "../styles/Footer.css";
const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <ul className="footer-links">
          <li>
            <a href="#about">О нас</a>
          </li>
          <li>
            <a href="#services">Услуги</a>
          </li>
          <li>
            <a href="#contact">Контакты</a>
          </li>
          <li>
            <a href="#privacy">Политика конфиденциальности</a>
          </li>
        </ul>
        <div className="footer-copy">
          &copy; {new Date().getFullYear()} LukaDeveloper. Все права защищены.
        </div>
      </div>
    </footer>
  );
};
export default Footer;
