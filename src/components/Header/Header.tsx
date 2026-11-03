import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { isAxiosError } from "axios";
import { logout } from "../../services/authService";
import { signedOut } from "../../store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import "./Header.css";

function Header() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const displayName = useAppSelector((state) => state.auth.displayName);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAccountMenuOpen) {
      return;
    }

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        event.target instanceof Node &&
        !accountMenuRef.current?.contains(event.target)
      ) {
        setIsAccountMenuOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsAccountMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isAccountMenuOpen]);

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);
    setLogoutError("");
    setIsAccountMenuOpen(false);

    try {
      await logout();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userName");
      setIsLogoutDialogOpen(false);
      dispatch(signedOut());
      navigate("/", { replace: true });
    } catch (error: unknown) {
      const apiMessage = isAxiosError<{ detail?: string; message?: string }>(
        error,
      )
        ? (error.response?.data?.detail ?? error.response?.data?.message)
        : undefined;
      setLogoutError(
        typeof apiMessage === "string"
          ? apiMessage
          : "Unable to log out. Please try again.",
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  const cancelLogout = () => {
    if (isLoggingOut) {
      return;
    }
    setLogoutError("");
    setIsLogoutDialogOpen(false);
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
          {isAuthenticated && (
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                isActive ? "header__link header__link--active" : "header__link"
              }
            >
              Cart
            </NavLink>
          )}
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
            <div className="header__account" ref={accountMenuRef}>
              <button
                type="button"
                className="header__login-button header__account-button"
                aria-haspopup="menu"
                aria-expanded={isAccountMenuOpen}
                onClick={() => setIsAccountMenuOpen((isOpen) => !isOpen)}
              >
                <span className="header__account-avatar" aria-hidden="true">
                  {(displayName?.trim() || "A").charAt(0).toUpperCase()}
                </span>
                <span className="header__account-name">
                  {displayName?.trim() || "My Account"}
                </span>
                <span className="header__account-chevron" aria-hidden="true">
                  ▾
                </span>
              </button>
              {isAccountMenuOpen && (
                <div className="header__account-menu" role="menu">
                  <NavLink
                    to="/profile"
                    role="menuitem"
                    onClick={() => setIsAccountMenuOpen(false)}
                  >
                    My Profile
                  </NavLink>
                  <NavLink
                    to="/orders"
                    role="menuitem"
                    onClick={() => setIsAccountMenuOpen(false)}
                  >
                    Orders
                  </NavLink>
                  <NavLink
                    to="/addresses"
                    role="menuitem"
                    onClick={() => setIsAccountMenuOpen(false)}
                  >
                    Addresses
                  </NavLink>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setLogoutError("");
                      setIsAccountMenuOpen(false);
                      setIsLogoutDialogOpen(true);
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <NavLink to="/login" className="header__login-button">
              Login / Signup
            </NavLink>
          )}
        </div>
      </div>
      <ConfirmDialog
        isOpen={isLogoutDialogOpen}
        title="Leaving so soon?"
        message={
          logoutError ||
          "Are you sure you want to log out of your CartLoom account?"
        }
        cancelLabel="Stay signed in"
        confirmLabel={isLoggingOut ? "Logging out…" : "Log out"}
        onCancel={cancelLogout}
        onConfirm={handleLogout}
      />
    </header>
  );
}

export default Header;
