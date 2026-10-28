import { Link } from "react-router-dom";
import PageContainer from "../../components/PageContainer/PageContainer";
import { Address } from "../../services/addressService";
import { formatAddress } from "./AddressSelectionPresenter";
import "./PaymentSelectionPresenter.css";

export type PaymentMethod = "upi" | "card" | "net-banking" | "cod";

interface PaymentSelectionPresenterProps {
  address: Address;
  itemCount: number;
  listPriceTotal: number;
  itemSubtotal: number;
  total: number;
  discount: number;
  isLoading: boolean;
  isPaying: boolean;
  error: string;
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onPay: () => void;
}

const paymentMethods: Array<{
  value: PaymentMethod;
  label: string;
  icon: string;
  description?: string;
}> = [
  {
    value: "upi",
    label: "UPI",
    icon: "◉",
    description: "Google Pay, PhonePe, etc.",
  },
  {
    value: "card",
    label: "Credit / Debit Card",
    icon: "▣",
    description: "Visa · Mastercard · RuPay",
  },
  { value: "net-banking", label: "Net Banking", icon: "▤" },
  { value: "cod", label: "Cash on Delivery (COD)", icon: "◷" },
];

const formatRupees = (amount: number) =>
  `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

function PaymentSelectionPresenter({
  address,
  itemCount,
  listPriceTotal,
  itemSubtotal,
  total,
  discount,
  isLoading,
  isPaying,
  error,
  paymentMethod,
  onPaymentMethodChange,
  onPay,
}: PaymentSelectionPresenterProps) {
  return (
    <PageContainer>
      <section
        className="checkout-page checkout-payment"
        aria-labelledby="payment-selection-title"
      >
        <header className="checkout-heading">
          <div>
            <p className="checkout-eyebrow">Checkout · Step 2 of 2</p>
            <h1 id="payment-selection-title">Payment selection</h1>
            <p>Choose how you’d like to pay for your order.</p>
          </div>
        </header>

        {error && (
          <p className="checkout-error" role="alert">
            {error}
          </p>
        )}
        {isLoading ? (
          <p className="checkout-state" role="status">
            Loading your order summary…
          </p>
        ) : itemCount === 0 ? (
          <div className="checkout-empty">
            <h2>Your cart is empty</h2>
            <p>Add items to your cart before placing an order.</p>
            <Link className="checkout-primary-link" to="/products">
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="payment-layout">
            <section
              className="payment-options"
              aria-labelledby="payment-method-title"
            >
              <h2 id="payment-method-title">Payment Method</h2>
              <div className="payment-option-list">
                {paymentMethods.map((method) => (
                  <label
                    className={`payment-option${paymentMethod === method.value ? " payment-option--selected" : ""}`}
                    key={method.value}
                  >
                    <input
                      type="radio"
                      name="payment-method"
                      value={method.value}
                      checked={paymentMethod === method.value}
                      onChange={() => onPaymentMethodChange(method.value)}
                    />
                    <span className="payment-option__icon" aria-hidden="true">
                      {method.icon}
                    </span>
                    <span className="payment-option__text">
                      <strong>{method.label}</strong>
                      {method.description && <span>{method.description}</span>}
                    </span>
                    {method.value === "card" && (
                      <span
                        className="payment-card-brands"
                        aria-label="Visa, Mastercard and RuPay"
                      >
                        VISA　🔴🔵　●
                      </span>
                    )}
                  </label>
                ))}
              </div>
              <div className="payment-delivery-address">
                <strong>
                  Delivering to: {address.label || "Saved address"}
                </strong>
                <span>
                  {formatAddress(address)}{" "}
                  {address.pin ? `· ${address.pin}` : ""}
                </span>
                <Link to="/checkout/address" state={{ address }}>
                  Change address
                </Link>
              </div>
            </section>

            <aside
              className="order-summary"
              aria-labelledby="order-summary-title"
            >
              <h2 id="order-summary-title">Order Summary</h2>
              <dl className="order-summary__rows">
                <div>
                  <dt>Items ({itemCount})</dt>
                  <dd>{formatRupees(listPriceTotal || itemSubtotal)}</dd>
                </div>
                <div>
                  <dt>Discount</dt>
                  <dd className="order-summary__discount">
                    −{formatRupees(discount)}
                  </dd>
                </div>
                <div>
                  <dt>Delivery</dt>
                  <dd className="order-summary__free">FREE</dd>
                </div>
              </dl>
              <div className="order-summary__total">
                <strong>Total Payable</strong>
                <strong>{formatRupees(total)}</strong>
              </div>
              <div className="payment-secure">
                <span aria-hidden="true">✓</span>
                <p>
                  <strong>Your payments are secure</strong>
                  <br />
                  256-bit SSL encryption
                </p>
              </div>
              <button
                className="checkout-primary-button payment-pay-button"
                type="button"
                onClick={onPay}
                disabled={isLoading || isPaying || itemCount === 0}
              >
                {isPaying ? "Placing order…" : `Pay ${formatRupees(total)} →`}
              </button>
            </aside>
          </div>
        )}
        {!isLoading && itemCount > 0 && (
          <Link
            className="checkout-back-link payment-back-link"
            to="/checkout/address"
            state={{ address }}
          >
            ← Back to delivery address
          </Link>
        )}
      </section>
    </PageContainer>
  );
}

export default PaymentSelectionPresenter;
