import { Link } from "react-router-dom";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import PageContainer from "../../components/PageContainer/PageContainer";
import { CartItem } from "../../services/cartService";
import "./CartPresenter.css";

interface CartPresenterProps {
  items: CartItem[];
  cartTotal: string;
  isLoading: boolean;
  error: string;
  actionError: string;
  updatingItemIds: Set<number>;
  itemToRemove: CartItem | null;
  isRemoving: boolean;
  onRetry: () => void;
  onPlaceOrder: () => void;
  onQuantityChange: (item: CartItem, quantity: number) => void;
  onRemoveRequest: (item: CartItem) => void;
  onRemoveConfirm: () => void;
  onRemoveCancel: () => void;
}

const formatRupees = (amount: number) =>
  `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

function CartPresenter({
  items,
  cartTotal,
  isLoading,
  error,
  actionError,
  updatingItemIds,
  itemToRemove,
  isRemoving,
  onRetry,
  onPlaceOrder,
  onQuantityChange,
  onRemoveRequest,
  onRemoveConfirm,
  onRemoveCancel,
}: CartPresenterProps) {
  const itemsTotal = items.reduce(
    (total, item) =>
      total + (Number(item.unit_price) || item.variant.price) * item.quantity,
    0,
  );
  const listPriceTotal = items.reduce(
    (total, item) => total + item.variant.originalPrice * item.quantity,
    0,
  );
  const discount = Math.max(0, listPriceTotal - itemsTotal);
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <PageContainer>
      <section className="cart-page" aria-labelledby="cart-title">
        <div className="cart-page__content">
          <header className="cart-page__heading">
            <div>
              {/* <p className="eyebrow">Your shopping bag</p> */}
              <h1 id="cart-title">
                My Cart <span>{items.length} item(s)</span>
              </h1>
            </div>
            {/* {!isLoading && !error && items.length > 0 && (
              <Link to="/products" className="cart-page__continue-link">
                Continue shopping <span aria-hidden="true">→</span>
              </Link>
            )} */}
          </header>

          {isLoading ? (
            <p className="cart-page__state" role="status">
              Loading your cart…
            </p>
          ) : error ? (
            <div
              className="cart-page__state cart-page__state--error"
              role="alert"
            >
              <p>{error}</p>
              <button type="button" onClick={onRetry}>
                Try again
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="cart-page__empty">
              <span aria-hidden="true">🛒</span>
              <h2>Your cart is empty</h2>
              <p>Looks like you haven’t added anything to your cart yet.</p>
              <Link to="/products" className="cart-page__primary-link">
                Explore products
              </Link>
            </div>
          ) : (
            <div className="cart-page__layout">
              {actionError && (
                <p className="cart-page__quantity-error" role="alert">
                  {actionError}
                </p>
              )}
              <div className="cart-page__items" aria-label="Cart items">
                {items.map((item) => {
                  const unitPrice =
                    Number(item.unit_price) || item.variant.price;
                  const originalPrice = item.variant.originalPrice;
                  const discountPercent = originalPrice
                    ? Math.round(
                        ((originalPrice - unitPrice) / originalPrice) * 100,
                      )
                    : 0;
                  const options = item.variant.options
                    .map((option) => option.value)
                    .join(", ");

                  return (
                    <article className="cart-item" key={item.item_id}>
                      <div className="cart-item__image-wrap">
                        {item.variant.images[0] ? (
                          <img
                            className="cart-item__image"
                            src={item.variant.images[0]}
                            alt={item.product_name}
                          />
                        ) : (
                          <span
                            className="cart-item__image-fallback"
                            aria-hidden="true"
                          >
                            🛍
                          </span>
                        )}
                      </div>

                      <div className="cart-item__details">
                        <h2>{item.product_name}</h2>
                        {options && (
                          <p className="cart-item__variant">{options}</p>
                        )}
                        <div className="cart-item__price-row">
                          <strong>{formatRupees(unitPrice)}</strong>
                          {originalPrice > unitPrice && (
                            <>
                              <del>{formatRupees(originalPrice)}</del>
                              {discountPercent > 0 && (
                                <span className="cart-item__discount">
                                  {discountPercent}% off
                                </span>
                              )}
                            </>
                          )}
                        </div>
                        <p className="cart-item__line-total">
                          Item total:{" "}
                          {formatRupees(
                            Number(item.line_total) ||
                              unitPrice * item.quantity,
                          )}
                        </p>
                      </div>

                      <div className="cart-item__actions">
                        <div className="cart-item__quantity">
                          <button
                            type="button"
                            aria-label={`Decrease ${item.product_name} quantity`}
                            onClick={() =>
                              onQuantityChange(item, item.quantity - 1)
                            }
                            disabled={
                              item.quantity <= 1 ||
                              updatingItemIds.has(item.item_id)
                            }
                          >
                            −
                          </button>
                          <strong>{item.quantity}</strong>
                          <button
                            type="button"
                            aria-label={`Increase ${item.product_name} quantity`}
                            onClick={() =>
                              onQuantityChange(item, item.quantity + 1)
                            }
                            disabled={
                              item.quantity >= item.variant.stock ||
                              updatingItemIds.has(item.item_id)
                            }
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          className="cart-item__remove"
                          onClick={() => onRemoveRequest(item)}
                          disabled={updatingItemIds.has(item.item_id)}
                        >
                          Remove
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>

              <aside
                className="cart-summary"
                aria-labelledby="cart-summary-title"
              >
                <h2 id="cart-summary-title">Price Details</h2>
                <dl className="cart-summary__rows">
                  <div>
                    <dt>Price ({totalItems} items)</dt>
                    <dd>{formatRupees(listPriceTotal)}</dd>
                  </div>
                  <div>
                    <dt>Discount</dt>
                    <dd className="cart-summary__discount">
                      −{formatRupees(discount)}
                    </dd>
                  </div>
                  <div>
                    <dt>Delivery Charges</dt>
                    <dd className="cart-summary__free">FREE</dd>
                  </div>
                </dl>
                <div className="cart-summary__total">
                  <strong>Total Amount</strong>
                  <strong>
                    {formatRupees(Number(cartTotal) || itemsTotal)}
                  </strong>
                </div>
                <p className="cart-summary__savings">
                  You will save {formatRupees(discount)} on this order
                </p>
                <button
                  type="button"
                  className="cart-summary__checkout"
                  onClick={onPlaceOrder}
                >
                  Place Order <span aria-hidden="true">→</span>
                </button>
                <p className="cart-summary__secure">
                  <span aria-hidden="true">◆</span> Safe &amp; Secure Checkout
                </p>
              </aside>
            </div>
          )}
        </div>
      </section>
      <ConfirmDialog
        isOpen={Boolean(itemToRemove)}
        title="Remove item from cart?"
        message={`Are you sure you want to remove ${itemToRemove?.product_name ?? "this item"} from the cart`}
        confirmLabel={isRemoving ? "Removing…" : "Remove item"}
        cancelLabel="Keep item"
        onConfirm={onRemoveConfirm}
        onCancel={onRemoveCancel}
      />
    </PageContainer>
  );
}

export default CartPresenter;
