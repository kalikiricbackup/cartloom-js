import { Product } from "../../types";
import "./ProductCard.css";
import Button from "../Button/Button";

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="plp-product-card">
      <div className="plp-product-card__image">
        <button
          type="button"
          className="plp-product-card__wishlist"
          aria-label={`Add ${product.name} to wishlist`}
        >
          ♡
        </button>
        <span>{product.image}</span>
      </div>
      <div className="plp-product-card__content">
        <h2>{product.name}</h2>
        <div className="plp-product-card__rating">
          <span>★ {product.rating}</span>
          <small>({product.reviews})</small>
        </div>
        <div className="plp-product-card__price">
          <strong>₹{product.price.toLocaleString("en-IN")}</strong>
          <del>₹{product.originalPrice.toLocaleString("en-IN")}</del>
        </div>
        <p className="plp-product-card__discount">
          {product.discountPercentage}% off
        </p>
        <div className="plp-product-card__features">
          <span>⭐ Assured</span>
          <span>🚚 Fast Delivery</span>
        </div>
        <Button onClick={() => console.log(`Add ${product.name} to cart`)}>
          Add to Cart
        </Button>
      </div>
    </article>
  );
}

export default ProductCard;
