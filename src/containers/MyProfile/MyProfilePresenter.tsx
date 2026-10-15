import { FormEvent } from "react";
import { ProfileDetails } from "./profileTypes";
import "./MyProfilePresenter.css";

interface MyProfilePresenterProps {
  profile: ProfileDetails;
  draft: ProfileDetails;
  initials: string;
  isEditing: boolean;
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
  onEdit,
  onCancel,
  onSubmit,
  onFullNameChange,
  onPhoneChange,
}: MyProfilePresenterProps) {
  return (
    <main className="my-profile" aria-labelledby="my-profile-title">
      <h1 id="my-profile-title">My Profile</h1>

      {!isEditing && (
        <section className="my-profile__summary" aria-label="Profile summary">
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
                value={draft.phone}
                onChange={(event) => onPhoneChange(event.target.value)}
              />
            </label>
            <label className="my-profile__field">
              <span>Gender</span>
              <select value={draft.gender} disabled>
                <option>Female</option>
                <option>Male</option>
                <option>Others</option>
              </select>
            </label>
            <div className="my-profile__actions">
              <button
                className="my-profile__button my-profile__button--secondary"
                type="button"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                className="my-profile__button my-profile__button--primary"
                type="submit"
              >
                Update
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
    </main>
  );
}

export default MyProfilePresenter;
