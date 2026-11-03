import { FormEvent } from "react";
import { ProfileDetails } from "./profileTypes";
import "./MyProfilePresenter.css";

interface MyProfilePresenterProps {
  profile: ProfileDetails | null;
  draft: ProfileDetails | null;
  initials: string;
  isEditing: boolean;
  isLoading: boolean;
  isSaving: boolean;
  loadError: string;
  saveError: string;
  hasChanges: boolean;
  onRetry: () => void;
  onEdit: () => void;
  onCancel: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onFullNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
}

function MyProfilePresenter({
  profile,
  draft,
  initials,
  isEditing,
  isLoading,
  isSaving,
  loadError,
  saveError,
  hasChanges,
  onRetry,
  onEdit,
  onCancel,
  onSubmit,
  onFullNameChange,
  onPhoneChange,
}: MyProfilePresenterProps) {
  return (
    <main className="my-profile" aria-labelledby="my-profile-title">
      <h1 id="my-profile-title">My Profile</h1>

      {isLoading ? (
        <p className="my-profile__status" role="status">
          Loading your profile…
        </p>
      ) : loadError ? (
        <div className="my-profile__error" role="alert">
          <p>{loadError}</p>
          <button type="button" onClick={onRetry}>
            Try again
          </button>
        </div>
      ) : profile && draft ? (
        <>
          {!isEditing && (
            <section
              className="my-profile__summary"
              aria-label="Profile summary"
            >
              <div className="my-profile__avatar" aria-hidden="true">
                {initials}
              </div>
              <div className="my-profile__summary-details">
                <h2>{profile.fullName}</h2>
                <p>{profile.email}</p>
                <p>{profile.phone}</p>
              </div>
              <button
                className="my-profile__edit-trigger"
                type="button"
                onClick={onEdit}
              >
                Edit Profile
              </button>
            </section>
          )}

          <section
            className="my-profile__information"
            aria-labelledby="profile-info-title"
          >
            <h2 id="profile-info-title">Account Information</h2>
            {isEditing ? (
              <form className="my-profile__form" onSubmit={onSubmit}>
                <label className="my-profile__field">
                  <span>Full Name</span>
                  <input
                    autoComplete="name"
                    required
                    disabled={isSaving}
                    value={draft.fullName}
                    onChange={(event) => onFullNameChange(event.target.value)}
                  />
                </label>
                <label className="my-profile__field">
                  <span>Email</span>
                  <input type="email" value={draft.email} readOnly />
                </label>
                <label className="my-profile__field">
                  <span>Phone</span>
                  <input
                    autoComplete="tel"
                    type="tel"
                    disabled={isSaving}
                    value={draft.phone}
                    onChange={(event) => onPhoneChange(event.target.value)}
                  />
                </label>
                <label className="my-profile__field">
                  <span>Gender</span>
                  <select value={draft.gender} disabled>
                    <option value={draft.gender}>{draft.gender}</option>
                  </select>
                </label>
                <div className="my-profile__actions">
                  {saveError && (
                    <p className="my-profile__form-error" role="alert">
                      {saveError}
                    </p>
                  )}
                  <button
                    className="my-profile__button my-profile__button--secondary"
                    type="button"
                    disabled={isSaving}
                    onClick={onCancel}
                  >
                    Cancel
                  </button>
                  <button
                    className="my-profile__button my-profile__button--primary"
                    type="submit"
                    disabled={!hasChanges || isSaving}
                  >
                    {isSaving ? "Updating…" : "Update"}
                  </button>
                </div>
              </form>
            ) : (
              <dl className="my-profile__details">
                <div>
                  <dt>Full Name</dt>
                  <dd>{profile.fullName}</dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>{profile.email}</dd>
                </div>
                <div>
                  <dt>Phone</dt>
                  <dd>+91 {profile.phone}</dd>
                </div>
                <div>
                  <dt>Gender</dt>
                  <dd>{profile.gender}</dd>
                </div>
              </dl>
            )}
          </section>
        </>
      ) : null}
    </main>
  );
}

export default MyProfilePresenter;
