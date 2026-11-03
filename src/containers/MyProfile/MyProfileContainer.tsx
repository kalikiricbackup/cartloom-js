import { FormEvent, useEffect, useState } from "react";
import { signedIn } from "../../store/slices/authSlice";
import { useAppDispatch } from "../../store/store";
import { ProfileDetails } from "./profileTypes";
import MyProfilePresenter from "./MyProfilePresenter";
import {
  getCurrentUser,
  getProfileErrorMessage,
  updateUserProfile,
} from "../../services/profileService";

function MyProfileContainer() {
  const dispatch = useAppDispatch();
  const [profile, setProfile] = useState<ProfileDetails | null>(null);
  const [draft, setDraft] = useState<ProfileDetails | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setLoadError("");

    getCurrentUser(controller.signal)
      .then((user) => {
        const userProfile: ProfileDetails = {
          fullName: user.full_name,
          email: user.email,
          phone: user.phone_number,
          gender:
            user.gender === 1
              ? "Male"
              : user.gender === 2
                ? "Female"
                : user.gender === 3
                  ? "Others"
                  : "Not specified",
        };
        setProfile(userProfile);
        setDraft(userProfile);
        localStorage.setItem("userName", userProfile.fullName);
        dispatch(signedIn(userProfile.fullName));
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setLoadError(getProfileErrorMessage(error));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [dispatch, reloadKey]);

  const startEditing = () => {
    if (!profile) return;
    setDraft(profile);
    setSaveError("");
    setIsEditing(true);
  };

  const cancelEditing = () => {
    if (profile) setDraft(profile);
    setSaveError("");
    setIsEditing(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!profile || !draft || !hasChanges) return;

    setIsSaving(true);
    setSaveError("");
    try {
      const updatedUser = await updateUserProfile({
        fullName: draft.fullName.trim(),
        phoneNumber: draft.phone.trim(),
      });
      const updatedProfile: ProfileDetails = {
        ...profile,
        fullName: updatedUser.full_name,
        email: updatedUser.email,
        phone: updatedUser.phone_number,
      };
      setProfile(updatedProfile);
      setDraft(updatedProfile);
      localStorage.setItem("userName", updatedProfile.fullName);
      dispatch(signedIn(updatedProfile.fullName));
      setIsEditing(false);
    } catch (error: unknown) {
      setSaveError(getProfileErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = Boolean(
    profile &&
    draft &&
      (profile.fullName !== draft.fullName.trim() ||
        profile.phone !== draft.phone.trim()),
  );

  const initials = (profile?.fullName ?? "")
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
      isLoading={isLoading}
      isSaving={isSaving}
      loadError={loadError}
      saveError={saveError}
      hasChanges={hasChanges}
      onRetry={() => setReloadKey((key) => key + 1)}
      onEdit={startEditing}
      onCancel={cancelEditing}
      onSubmit={handleSubmit}
      onFullNameChange={(fullName) =>
        setDraft((current) => (current ? { ...current, fullName } : current))
      }
      onPhoneChange={(phone) =>
        setDraft((current) => (current ? { ...current, phone } : current))
      }
    />
  );
}

export default MyProfileContainer;
