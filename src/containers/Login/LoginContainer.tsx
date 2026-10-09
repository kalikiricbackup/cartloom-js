import { isAxiosError } from "axios";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import { signedIn } from "../../store/slices/authSlice";
import { useAppDispatch } from "../../store/store";
import LoginPresenter from "./LoginPresenter";

function LoginContainer() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<"mobile" | "email">("mobile");
  const [showOtp, setShowOtp] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleTabChange(tab: "mobile" | "email") {
    setActiveTab(tab);
    setShowOtp(false);
    setMessage("");
  }

  function handlePhoneSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setShowOtp(true);
    setMessage("");
  }

  function handleOtpChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    setOtp((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? digit : item)),
    );
    setMessage("");
  }

  function handleOtpSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(
      "OTP sign-in is not connected yet. Please use email and password to sign in.",
    );
  }

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await login({
        email: String(formData.get("email")).trim(),
        password: String(formData.get("password")),
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
            : "Login failed. Please check your email and password and try again.",
        );
      } else {
        setMessage("Login failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <LoginPresenter
      activeTab={activeTab}
      showOtp={showOtp}
      phone={phone}
      otp={otp}
      message={message}
      isSubmitting={isSubmitting}
      onTabChange={handleTabChange}
      onPhoneChange={setPhone}
      onPhoneSubmit={handlePhoneSubmit}
      onOtpChange={handleOtpChange}
      onOtpSubmit={handleOtpSubmit}
      onChangeNumber={() => {
        setShowOtp(false);
        setMessage("");
      }}
      onEmailSubmit={handleEmailSubmit}
    />
  );
}

export default LoginContainer;
