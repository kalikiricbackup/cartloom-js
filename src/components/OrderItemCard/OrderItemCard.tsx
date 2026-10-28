import { OrderItem } from "../../services/orderService";
import "./OrderItemCard.css";

interface OrderItemCardProps {
  item: OrderItem;
}

const formatRupees = (amount: string | number) =>
  `₹${(Number(amount) || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

function OrderItemCard({ item }: OrderItemCardProps) {
  const image = item.variant.images[0];
  const selectedVariant = item.variant.options
    .map((option) => `${option.label}: ${option.value}`)
    .join(" · ");

  return (
    <article className="order-item-card">
      <div className="order-item-card__image">
        {image ? (
          <img src={image} alt={item.product_name} loading="lazy" />
        ) : (
          <span aria-hidden="true">📦</span>
        )}
      </div>
      <div className="order-item-card__details">
        <h3>{item.product_name}</h3>
        {selectedVariant && (
          <p className="order-item-card__variant">{selectedVariant}</p>
        )}
        <p className="order-item-card__quantity">Quantity: {item.quantity}</p>
      </div>
      <div className="order-item-card__price">
        <strong>{formatRupees(item.unit_price)}</strong>
        {item.quantity > 1 && (
          <span>Line total: {formatRupees(item.line_total)}</span>
        )}
      </div>
    </article>
  );
}

export default OrderItemCard;
