import PageContainer from "../../components/PageContainer/PageContainer";
import OrderItemCard from "../../components/OrderItemCard/OrderItemCard";
import { Order } from "../../services/orderService";
import "./MyOrdersPresenter.css";

interface MyOrdersPresenterProps {
  orders: Order[];
  isLoading: boolean;
  error: string;
}

const formatRupees = (amount: string) =>
  `₹${(Number(amount) || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

function MyOrdersPresenter({
  orders,
  isLoading,
  error,
}: MyOrdersPresenterProps) {
  return (
    <PageContainer>
      <section className="my-orders" aria-labelledby="my-orders-title">
        <header className="checkout-heading">
          <div>
            {/* <p className="checkout-eyebrow">Your account</p> */}
            <h1 id="my-orders-title">My Orders</h1>
            {/* <p>Track your recent purchases and order details.</p> */}
          </div>
        </header>
        {isLoading ? (
          <p className="checkout-state" role="status">
            Loading your orders…
          </p>
        ) : error ? (
          <p className="checkout-error" role="alert">
            {error}
          </p>
        ) : orders.length === 0 ? (
          <div className="checkout-empty">
            <h2>No orders yet</h2>
            <p>Your placed orders will appear here.</p>
          </div>
        ) : (
          <div className="my-orders__list">
            {orders.map((order) => (
              <article className="my-order-card" key={order.id}>
                <header className="my-order-card__header">
                  <div>
                    <span>Order ID</span>
                    <strong>#{order.id}</strong>
                  </div>
                  <div>
                    <span>Placed</span>
                    <strong>
                      {new Date(order.created_at).toLocaleDateString()}
                    </strong>
                  </div>
                  <span className="my-order-card__status">{order.status}</span>
                </header>
                <ul className="my-order-card__items">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      <OrderItemCard item={item} />
                    </li>
                  ))}
                </ul>
                <footer>
                  <span>
                    Deliver to: {order.shipping_address} · {order.shipping_pin}
                  </span>
                  <strong>Total: {formatRupees(order.total_amount)}</strong>
                </footer>
              </article>
            ))}
          </div>
        )}
      </section>
    </PageContainer>
  );
}

export default MyOrdersPresenter;
