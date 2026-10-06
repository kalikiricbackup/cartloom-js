import { FormEventHandler } from "react";
import { Link } from "react-router-dom";

interface LoginPresenterProps {
  activeTab: "mobile" | "email";
  showOtp: boolean;
  phone: string;
  otp: string[];
  message: string;
  isSubmitting: boolean;
  onTabChange: (tab: "mobile" | "email") => void;
  onPhoneChange: (phone: string) => void;
  onPhoneSubmit: FormEventHandler<HTMLFormElement>;
  onOtpChange: (index: number, value: string) => void;
  onOtpSubmit: FormEventHandler<HTMLFormElement>;
  onChangeNumber: () => void;
  onEmailSubmit: FormEventHandler<HTMLFormElement>;
}

function LoginPresenter({
  activeTab,
  showOtp,
  phone,
  otp,
  message,
  isSubmitting,
  onTabChange,
  onPhoneChange,
  onPhoneSubmit,
  onOtpChange,
  onOtpSubmit,
  onChangeNumber,
  onEmailSubmit,
}: LoginPresenterProps) {
  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <aside className="login-art" aria-label="CartLoom shopping benefits">
          <div className="login-art__copy">
            <span className="login-art__eyebrow">
              Your everyday marketplace
            </span>
            <h2>
              Shop smarter.
              <br />
              <span>Shop better.</span>
            </h2>
            <p>
              Discover the best products at unbeatable prices with fast and
              reliable delivery.
            </p>
            <ul className="login-benefits">
              <li>
                <span aria-hidden="true">↗</span>
                <div>
                  <strong>Exciting deals</strong>
                  <small>Fresh finds, great savings</small>
                </div>
              </li>
              <li>
                <span aria-hidden="true">✦</span>
                <div>
                  <strong>Fast delivery</strong>
                  <small>Right to your doorstep</small>
                </div>
              </li>
              <li>
                <span aria-hidden="true">✓</span>
                <div>
                  <strong>Secure payments</strong>
                  <small>Shop with confidence</small>
                </div>
              </li>
            </ul>
          </div>
          <div className="login-art__scene" aria-hidden="true">
            <span className="login-art__plant">🌿</span>
            <span className="login-art__parcel login-art__parcel--left">
              📦
            </span>
            <span className="login-art__bag">🛍️</span>
            <span className="login-art__phone">🛒</span>
            <span className="login-art__parcel login-art__parcel--right">
              🎁
            </span>
            <span className="login-art__sparkle login-art__sparkle--one">
              ✦
            </span>
            <span className="login-art__sparkle login-art__sparkle--two">
              ✧
            </span>
          </div>
          <p className="login-art__caption">
            Your next favorite thing is waiting.
          </p>
        </aside>

        <div className="login-panel">
          {showOtp ? (
            <>
              <div className="login-heading">
                <span className="login-heading__step">
                  02 · OTP verification
                </span>
                <h1 id="login-title">Almost there!</h1>
                <p>Enter the verification code sent to</p>
                <strong className="login-phone-summary">+91 {phone}</strong>
                <button
                  className="login-text-button"
                  type="button"
                  onClick={onChangeNumber}
                >
                  Edit number
                </button>
              </div>
              <form className="login-form" onSubmit={onOtpSubmit}>
                <div className="otp-inputs" aria-label="One-time password">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      aria-label={`OTP digit ${index + 1}`}
                      autoComplete={index === 0 ? "one-time-code" : "off"}
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(event) =>
                        onOtpChange(index, event.currentTarget.value)
                      }
                    />
                  ))}
                </div>
                <p className="login-resend">
                  OTP sign-in preview · verification is not connected yet
                </p>
                <button className="login-submit" type="submit">
                  Verify OTP <span aria-hidden="true">→</span>
                </button>
                <button
                  className="login-text-button login-text-button--center"
                  type="button"
                  onClick={onChangeNumber}
                >
                  Change number
                </button>
                {message && (
                  <p className="login-status" role="status">
                    {message}
                  </p>
                )}
              </form>
            </>
          ) : (
            <>
              <div className="login-heading">
                <span className="login-heading__step">Welcome to CartLoom</span>
                <h1 id="login-title">
                  Welcome back <span aria-hidden="true">👋</span>
                </h1>
                <p>Login or signup to continue your shopping journey</p>
              </div>

              <div
                className="login-tabs"
                role="tablist"
                aria-label="Sign-in method"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "mobile"}
                  className={
                    activeTab === "mobile"
                      ? "login-tab login-tab--active"
                      : "login-tab"
                  }
                  onClick={() => onTabChange("mobile")}
                >
                  Mobile number
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "email"}
                  className={
                    activeTab === "email"
                      ? "login-tab login-tab--active"
                      : "login-tab"
                  }
                  onClick={() => onTabChange("email")}
                >
                  Email address
                </button>
              </div>

              {activeTab === "mobile" ? (
                <form className="login-form" onSubmit={onPhoneSubmit}>
                  <label className="login-label" htmlFor="login-phone">
                    Mobile number
                  </label>
                  <div className="login-phone-field">
                    <span className="login-country">🇮🇳 &nbsp;+91</span>
                    <input
                      id="login-phone"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      placeholder="Enter your mobile number"
                      pattern="[0-9]{10}"
                      maxLength={10}
                      value={phone}
                      onChange={(event) =>
                        onPhoneChange(
                          event.currentTarget.value.replace(/\D/g, ""),
                        )
                      }
                      required
                    />
                  </div>
                  <button className="login-submit" type="submit">
                    Continue <span aria-hidden="true">→</span>
                  </button>
                  <p className="login-info">
                    Phone sign-in is a preview. Use email and password to sign
                    in.
                  </p>
                  {message && (
                    <p className="login-status" role="status">
                      {message}
                    </p>
                  )}
                </form>
              ) : (
                <form className="login-form" onSubmit={onEmailSubmit}>
                  <label className="login-label" htmlFor="login-email">
                    Email address
                  </label>
                  <input
                    className="login-input"
                    id="login-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                  />
                  <label className="login-label" htmlFor="login-password">
                    Password
                  </label>
                  <input
                    className="login-input"
                    id="login-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    className="login-submit"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Signing in…" : "Login"}{" "}
                    <span aria-hidden="true">→</span>
                  </button>
                  {message && (
                    <p className="login-status" role="alert">
                      {message}
                    </p>
                  )}
                </form>
              )}

              <div className="login-divider">
                <span>OR</span>
              </div>
              <p className="login-security">
                <span aria-hidden="true">✓</span> Your information is secure
                with us
              </p>
              <p className="login-signup">
                New to CartLoom? <Link to="/register">Create an account</Link>
              </p>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

export default LoginPresenter;
