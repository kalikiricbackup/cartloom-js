import { FormEvent, useState } from "react";
import { signedIn } from "../../store/slices/authSlice";
import { useAppDispatch } from "../../store/store";
import { ProfileDetails } from "./profileTypes";
import MyProfilePresenter from "./MyProfilePresenter";

const initialProfile: ProfileDetails = {
  fullName: "Sainath G",
  email: "sai1@gmail.com",
  phone: "90000011111",
  gender: "Male",
};

function MyProfileContainer() {
  const dispatch = useAppDispatch();
  const [profile, setProfile] = useState(initialProfile);
  const [draft, setDraft] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);

  const startEditing = () => {
    setDraft(profile);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setDraft(profile);
    setIsEditing(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Replace this local update with the profile update API when it is available.
    setProfile(draft);
    localStorage.setItem("userName", draft.fullName);
    dispatch(signedIn(draft.fullName));
    setIsEditing(false);
  };

  const initials = profile.fullName
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <MyProfilePresenter
      profile={profile}
      draft={draft}
      initials={initials}
      isEditing={isEditing}
      onEdit={startEditing}
      onCancel={cancelEditing}
      onSubmit={handleSubmit}
      onFullNameChange={(fullName) =>
        setDraft((current) => ({ ...current, fullName }))
      }
      onPhoneChange={(phone) => setDraft((current) => ({ ...current, phone }))}
    />
  );
}

export default MyProfileContainer;
