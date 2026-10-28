import { Link } from "react-router-dom";
import PageContainer from "../../components/PageContainer/PageContainer";
import "./OrderSuccessPresenter.css";

interface OrderSuccessPresenterProps {
  orderId?: number;
}

function OrderSuccessPresenter({ orderId }: OrderSuccessPresenterProps) {
  return (
    <PageContainer>
      <section className="order-success" aria-labelledby="order-success-title">
        <span className="order-success__icon" aria-hidden="true">
          ✓
        </span>
        <p className="checkout-eyebrow">Thank you for shopping with us</p>
        <h1 id="order-success-title">Order Placed Successfully</h1>
        {orderId ? (
          <p className="order-success__id">
            Your order ID - <strong>{orderId}</strong>
          </p>
        ) : (
          <p className="order-success__id">Your order has been placed.</p>
        )}
        <div className="order-success__actions">
          <Link className="checkout-primary-link" to="/orders">
            View orders
          </Link>
          <Link className="checkout-outline-link" to="/">
            Continue shopping
          </Link>
        </div>
      </section>
    </PageContainer>
  );
}

export default OrderSuccessPresenter;
