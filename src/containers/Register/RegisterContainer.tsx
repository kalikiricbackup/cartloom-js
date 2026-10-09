import { isAxiosError } from "axios";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../services/authService";
import { signedIn } from "../../store/slices/authSlice";
import { useAppDispatch } from "../../store/store";
import RegisterPresenter from "./RegisterPresenter";

function RegisterContainer() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event: FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    const formData = new FormData(form);
    const passwordsMatch =
      formData.get("password") === formData.get("confirmPassword");

    setCanSubmit(
      form.checkValidity() &&
        String(formData.get("name")).trim().length > 0 &&
        String(formData.get("address")).trim().length > 0 &&
        passwordsMatch,
    );
    setMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (formData.get("password") !== formData.get("confirmPassword")) {
      setMessage("Your passwords don't match. Please check and try again.");
      setCanSubmit(false);
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await register({
        fullName: String(formData.get("name")).trim(),
        email: String(formData.get("email")).trim(),
        password: String(formData.get("password")),
        gender: Number(formData.get("gender")),
        address: String(formData.get("address")).trim(),
        pin: String(formData.get("pin")),
      });

      localStorage.setItem("accessToken", response.access_token);
      localStorage.setItem("refreshToken", response.refresh_token);
      dispatch(signedIn());
      navigate("/");
    } catch (error: unknown) {
      if (isAxiosError<{ detail?: string; message?: string }>(error)) {
        const apiMessage =
          error.response?.data?.detail ?? error.response?.data?.message;
        setMessage(
          typeof apiMessage === "string"
            ? apiMessage
            : "Registration failed. Please check your details and try again.",
        );
      } else {
        setMessage("Registration failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <RegisterPresenter
      message={message}
      canSubmit={canSubmit}
      isSubmitting={isSubmitting}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
}

export default RegisterContainer;
