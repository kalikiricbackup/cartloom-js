import { Link } from "react-router-dom";
import PageContainer from "../../components/PageContainer/PageContainer";
import { Address } from "../../services/addressService";
import "./AddressSelectionPresenter.css";

interface AddressSelectionPresenterProps {
  addresses: Address[];
  selectedId: number | null;
  isLoading: boolean;
  error: string;
  onSelect: (id: number) => void;
  onContinue: () => void;
}

export const formatAddress = (address: Address): string =>
  [address.address, address.street, address.city, address.state]
    .filter(Boolean)
    .filter((part, index, parts) => parts.indexOf(part) === index)
    .join(", ");

function AddressSelectionPresenter({
  addresses,
  selectedId,
  isLoading,
  error,
  onSelect,
  onContinue,
}: AddressSelectionPresenterProps) {
  const selectedAddress = addresses.find(
    (address) => address.id === selectedId,
  );

  return (
    <PageContainer>
      <section
        className="checkout-page"
        aria-labelledby="address-selection-title"
      >
        <header className="checkout-heading">
          <div>
            <p className="checkout-eyebrow">Checkout · Step 1 of 2</p>
            <h1 id="address-selection-title">Choose a delivery address</h1>
            <p>Select where you’d like your order delivered.</p>
          </div>
          <Link className="checkout-secondary-link" to="/addresses/new">
            Add a new address
          </Link>
        </header>

        {error && (
          <p className="checkout-error" role="alert">
            {error}
          </p>
        )}
        {isLoading ? (
          <p className="checkout-state" role="status">
            Loading your addresses…
          </p>
        ) : addresses.length === 0 ? (
          <div className="checkout-empty">
            <h2>No saved addresses yet</h2>
            <p>Add a delivery address to continue with your order.</p>
            <Link className="checkout-primary-link" to="/addresses/new">
              Add address
            </Link>
          </div>
        ) : (
          <fieldset className="checkout-address-list">
            <legend className="visually-hidden">
              Saved delivery addresses
            </legend>
            {addresses.map((address) => (
              <label
                className={`checkout-address-card${selectedId === address.id ? " checkout-address-card--selected" : ""}`}
                key={address.id}
              >
                <input
                  type="radio"
                  name="delivery-address"
                  value={address.id}
                  checked={selectedId === address.id}
                  onChange={() => onSelect(address.id)}
                />
                <span className="checkout-address-card__body">
                  <strong>{address.label || "Saved address"}</strong>
                  <span>{formatAddress(address)}</span>
                  <span>PIN: {address.pin}</span>
                </span>
                {selectedId === address.id && (
                  <span className="checkout-selected-tag">Selected</span>
                )}
              </label>
            ))}
          </fieldset>
        )}

        <footer className="checkout-footer">
          <Link className="checkout-back-link" to="/cart">
            ← Back to cart
          </Link>
          <button
            className="checkout-primary-button"
            type="button"
            disabled={!selectedAddress || isLoading}
            onClick={onContinue}
          >
            Continue to payment <span aria-hidden="true">→</span>
          </button>
        </footer>
      </section>
    </PageContainer>
  );
}

export default AddressSelectionPresenter;
