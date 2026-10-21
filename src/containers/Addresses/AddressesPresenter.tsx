import { FormEvent } from "react";
import { Link } from "react-router-dom";
import { Address, AddressUpdateRequest } from "../../services/addressService";
import "./AddressesPresenter.css";

const getAddressSummary = (address: Address): string => {
  const parts = [address.street, address.city, address.state].filter(Boolean);
  const formattedParts = parts.join(", ");

  if (
    formattedParts &&
    address.address
      .toLocaleLowerCase()
      .includes(formattedParts.toLocaleLowerCase())
  ) {
    return address.address;
  }

  return [address.address, ...parts].filter(Boolean).join(", ");
};

interface AddressesPresenterProps {
  addresses: Address[];
  draft: AddressUpdateRequest | null;
  error: string;
  isLoading: boolean;
  isSaving: boolean;
  onEdit: (address: Address) => void;
  onCancelEdit: () => void;
  onFieldChange: (field: keyof AddressUpdateRequest, value: string) => void;
  onUpdate: (event: FormEvent<HTMLFormElement>) => void;
  onDelete: (address: Address) => void;
}

function AddressesPresenter({
  addresses,
  draft,
  error,
  isLoading,
  isSaving,
  onEdit,
  onCancelEdit,
  onFieldChange,
  onUpdate,
  onDelete,
}: AddressesPresenterProps) {
  return (
    <section className="addresses" aria-labelledby="addresses-title">
      <header className="addresses__header">
        <div>
          <p className="addresses__eyebrow">Your account</p>
          <h1 id="addresses-title">Saved addresses</h1>
          <p className="addresses__intro">
            View and manage the addresses saved to your account.
          </p>
          <Link className="addresses__add-button" to="/addresses/new">
            Add New Address
          </Link>
        </div>
        <span className="addresses__count">
          {addresses.length} {addresses.length === 1 ? "address" : "addresses"}
        </span>
      </header>

      {error && (
        <p className="addresses__error" role="alert">
          {error}
        </p>
      )}

      {isLoading ? (
        <div className="addresses__status" role="status">
          Loading your addresses…
        </div>
      ) : addresses.length === 0 ? (
        <div className="addresses__empty">
          <span className="addresses__empty-icon" aria-hidden="true">
            ⌂
          </span>
          <h2>No saved addresses yet</h2>
          <p>Addresses you add to your account will appear here.</p>
        </div>
      ) : (
        <div className="addresses__list">
          {addresses.map((address) =>
            draft?.id === address.id ? (
              <form
                className="address-card address-card--editing"
                key={address.id}
                onSubmit={onUpdate}
              >
                <div className="address-card__heading">
                  <span className="address-card__badge">Editing address</span>
                  <h2>{address.label || "Saved address"}</h2>
                </div>
                <div className="address-card__form">
                  <label className="address-card__field">
                    <span>Label</span>
                    <input
                      required
                      value={draft.label}
                      onChange={(event) =>
                        onFieldChange("label", event.target.value)
                      }
                    />
                  </label>
                  <label className="address-card__field">
                    <span>Address</span>
                    <input
                      required
                      autoComplete="address-line1"
                      value={draft.address}
                      onChange={(event) =>
                        onFieldChange("address", event.target.value)
                      }
                    />
                  </label>
                  <label className="address-card__field">
                    <span>Street</span>
                    <input
                      required
                      autoComplete="address-line2"
                      value={draft.street}
                      onChange={(event) =>
                        onFieldChange("street", event.target.value)
                      }
                    />
                  </label>
                  <label className="address-card__field">
                    <span>City</span>
                    <input
                      required
                      autoComplete="address-level2"
                      value={draft.city}
                      onChange={(event) =>
                        onFieldChange("city", event.target.value)
                      }
                    />
                  </label>
                  <label className="address-card__field">
                    <span>State</span>
                    <input
                      required
                      autoComplete="address-level1"
                      value={draft.state}
                      onChange={(event) =>
                        onFieldChange("state", event.target.value)
                      }
                    />
                  </label>
                  <label className="address-card__field">
                    <span>PIN code</span>
                    <input
                      required
                      autoComplete="postal-code"
                      inputMode="numeric"
                      value={draft.pin}
                      onChange={(event) =>
                        onFieldChange("pin", event.target.value)
                      }
                    />
                  </label>
                </div>
                <div className="address-card__actions">
                  <button
                    className="address-card__button address-card__button--secondary"
                    type="button"
                    onClick={onCancelEdit}
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button
                    className="address-card__button address-card__button--primary"
                    type="submit"
                    disabled={isSaving}
                  >
                    {isSaving ? "Updating…" : "Update address"}
                  </button>
                </div>
              </form>
            ) : (
              <article className="address-card" key={address.id}>
                <button
                  className="address-card__content"
                  type="button"
                  onClick={() => onEdit(address)}
                  aria-label={`Edit ${address.label || "saved"} address`}
                >
                  <span className="address-card__badge">
                    {address.label || "Address"}
                  </span>
                  <span className="address-card__address">
                    {getAddressSummary(address)}
                  </span>
                  <span className="address-card__pin">PIN: {address.pin}</span>
                  <span className="address-card__edit-hint">Click to edit</span>
                </button>
                <button
                  className="address-card__delete"
                  type="button"
                  onClick={() => onDelete(address)}
                  aria-label={`Delete ${address.label || "saved"} address`}
                >
                  Delete
                </button>
              </article>
            ),
          )}
        </div>
      )}
    </section>
  );
}

export default AddressesPresenter;
