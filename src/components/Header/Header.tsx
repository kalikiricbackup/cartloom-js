import { NavLink } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="header__container">
        <div className="header__logo">CartLoom</div>

        <nav className="header__navigation">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "header__link header__link--active" : "header__link"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive ? "header__link header__link--active" : "header__link"
            }
          >
            Products
          </NavLink>
          <a href="/">Contact</a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
