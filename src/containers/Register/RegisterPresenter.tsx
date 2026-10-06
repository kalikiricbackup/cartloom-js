import { FormEventHandler } from "react";
import { Link } from "react-router-dom";

interface RegisterPresenterProps {
  message: string;
  canSubmit: boolean;
  isSubmitting: boolean;
  onChange: FormEventHandler<HTMLFormElement>;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

function RegisterPresenter({
  message,
  canSubmit,
  isSubmitting,
  onChange,
  onSubmit,
}: RegisterPresenterProps) {
  return (
    <main className="register-page">
      <section className="register-card" aria-labelledby="register-title">
        <div className="register-art" aria-hidden="true">
          <div className="register-art__sparkle register-art__sparkle--one">
            ✦
          </div>
          <div className="register-art__sparkle register-art__sparkle--two">
            ✧
          </div>
          <div className="register-art__message">
            <span className="register-art__eyebrow">A little more joy</span>
            <strong>
              Good finds.
              <br />
              Great deals.
            </strong>
            <span>Make CartLoom yours.</span>
          </div>
          <div className="register-art__scene">
            <span className="register-art__plant">🌿</span>
            <div className="register-art__bag">🛍️</div>
            <span className="register-art__parcel register-art__parcel--one">
              🎁
            </span>
            <span className="register-art__parcel register-art__parcel--two">
              📦
            </span>
          </div>
          <p className="register-art__caption">
            Your next favorite thing is waiting.
          </p>
        </div>

        <div className="register-form-panel">
          <div className="register-heading">
            <span className="register-heading__step">
              ✦ Create your account
            </span>
            <h1 id="register-title">
              Welcome to CartLoom <span aria-hidden="true">👋</span>
            </h1>
            <p>Sign up for a more personal shopping experience.</p>
          </div>

          <form
            className="register-form"
            onChange={onChange}
            onSubmit={onSubmit}
          >
            <label className="register-field">
              <span>
                Full name <span className="register-required">*</span>
              </span>
              <input
                name="name"
                type="text"
                autoComplete="name"
                placeholder="e.g. Sam Patel"
                required
              />
            </label>

            <label className="register-field">
              <span>
                Email address <span className="register-required">*</span>
              </span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
              />
            </label>

            <div className="register-form__row">
              <label className="register-field">
                <span>
                  Password <span className="register-required">*</span>
                </span>
                <input
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  minLength={8}
                  required
                />
              </label>
              <label className="register-field">
                <span>
                  Confirm password <span className="register-required">*</span>
                </span>
                <input
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Enter it again"
                  minLength={8}
                  required
                />
              </label>
            </div>

            <label className="register-field">
              <span>
                Address <span className="register-required">*</span>
              </span>
              <textarea
                name="address"
                autoComplete="street-address"
                placeholder="Street and city"
                rows={2}
                required
              />
            </label>

            <label className="register-field">
              <span>
                Pincode <span className="register-required">*</span>
              </span>
              <input
                name="pin"
                type="text"
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="Enter your pincode"
                pattern="[0-9]+"
                required
                onChange={(event) => {
                  event.currentTarget.value = event.currentTarget.value.replace(
                    /\D/g,
                    "",
                  );
                }}
              />
            </label>

            <fieldset className="register-gender">
              <legend>
                Gender <span className="register-required">*</span>
              </legend>
              <label>
                <input type="radio" name="gender" value="2" required /> Female
              </label>
              <label>
                <input type="radio" name="gender" value="1" required /> Male
              </label>
              <label>
                <input type="radio" name="gender" value="3" required /> Others
              </label>
            </fieldset>

            <label className="register-consent">
              <input type="checkbox" name="terms" required />
              <span>I agree to CartLoom's terms and privacy policy.</span>
            </label>

            <button
              className="register-submit"
              type="submit"
              disabled={!canSubmit || isSubmitting}
            >
              {isSubmitting ? "Creating account…" : "Create account"}{" "}
              <span aria-hidden="true">→</span>
            </button>
            <p className="register-status" aria-live="polite">
              {message}
            </p>
            <p className="register-login">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}

export default RegisterPresenter;
