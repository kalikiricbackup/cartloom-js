import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageContainer from "../../components/PageContainer/PageContainer";
import {
  CreateAddressRequest,
  createAddress,
  getAddressErrorMessage,
} from "../../services/addressService";
import "./AddAddress.css";

const emptyAddress: CreateAddressRequest = {
  label: "",
  street: "",
  city: "",
  state: "",
  pin: "",
};

function AddAddress() {
  const navigate = useNavigate();
  const [address, setAddress] = useState(emptyAddress);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleFieldChange = (
    field: keyof CreateAddressRequest,
    value: string,
  ) => {
    setAddress((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSaving) {
      return;
    }

    setIsSaving(true);
    setError("");
    try {
      await createAddress(address);
      navigate("/addresses", { replace: true });
    } catch (requestError) {
      setError(getAddressErrorMessage(requestError));
      setIsSaving(false);
    }
  };

  return (
    <PageContainer>
      <section className="add-address" aria-labelledby="add-address-title">
        <div className="add-address__heading">
          <p className="addresses__eyebrow">Your account</p>
          <h1 id="add-address-title">Add a new address</h1>
          <p>Enter the address details you want to save to your account.</p>
        </div>

        {error && (
          <p className="addresses__error" role="alert">
            {error}
          </p>
        )}

        <form className="add-address__form" onSubmit={handleSubmit}>
          <label className="add-address__field">
            <span>Label</span>
            <input
              required
              autoComplete="off"
              placeholder="Home, Work, etc."
              value={address.label}
              onChange={(event) =>
                handleFieldChange("label", event.target.value)
              }
            />
          </label>
          <label className="add-address__field">
            <span>Street</span>
            <input
              required
              autoComplete="address-line1"
              value={address.street}
              onChange={(event) =>
                handleFieldChange("street", event.target.value)
              }
            />
          </label>
          <label className="add-address__field">
            <span>City</span>
            <input
              required
              autoComplete="address-level2"
              value={address.city}
              onChange={(event) =>
                handleFieldChange("city", event.target.value)
              }
            />
          </label>
          <label className="add-address__field">
            <span>State</span>
            <input
              required
              autoComplete="address-level1"
              value={address.state}
              onChange={(event) =>
                handleFieldChange("state", event.target.value)
              }
            />
          </label>
          <label className="add-address__field">
            <span>PIN code</span>
            <input
              required
              autoComplete="postal-code"
              inputMode="numeric"
              value={address.pin}
              onChange={(event) => handleFieldChange("pin", event.target.value)}
            />
          </label>
          <div className="add-address__actions">
            <Link
              className="add-address__button add-address__button--secondary"
              to="/addresses"
            >
              Cancel
            </Link>
            <button
              className="add-address__button add-address__button--primary"
              type="submit"
              disabled={isSaving}
            >
              {isSaving ? "Saving…" : "Save address"}
            </button>
          </div>
        </form>
      </section>
    </PageContainer>
  );
}

export default AddAddress;
