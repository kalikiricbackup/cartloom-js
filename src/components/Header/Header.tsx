import { NavLink, useNavigate } from "react-router-dom";
import { signedOut } from "../../store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";
import "./Header.css";

function Header() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    const shouldLogout = window.confirm("Are you sure you want to log out?");

    if (!shouldLogout) {
      return;
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    dispatch(signedOut());
    navigate("/", { replace: true });
  };

  return (
    <header className="header">
      <div className="header__container">
        <NavLink to="/" className="header__logo">
          <span className="header__logo-icon">□</span>

          <span>CartLoom</span>
        </NavLink>

        <nav className="header__navigation">
          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive ? "header__link header__link--active" : "header__link"
            }
          >
            Products
          </NavLink>

          {isAuthenticated && (
            <NavLink
              to="/wishlist"
              className={({ isActive }) =>
                isActive ? "header__link header__link--active" : "header__link"
              }
            >
              Wishlist
            </NavLink>
          )}

          <NavLink
            to="/cart"
            className={({ isActive }) =>
              isActive ? "header__link header__link--active" : "header__link"
            }
          >
            Cart (0)
          </NavLink>

          <NavLink
            to="/help"
            className={({ isActive }) =>
              isActive ? "header__link header__link--active" : "header__link"
            }
          >
            Help
          </NavLink>
        </nav>

        <div className="header__actions">
          <button
            type="button"
            className="header__theme-button"
            aria-label="Toggle theme"
          >
            ◐
          </button>

          {isAuthenticated ? (
            <button
              type="button"
              className="header__login-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <NavLink to="/login" className="header__login-button">
              Login / Signup
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
