import { Product } from "../../types";
import "./ProductCard.css";
import Button from "../Button/Button";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const firstVariant = product.variants[0];
  const firstImage = firstVariant?.images[0];
  const discountPercentage = firstVariant
    ? Math.round(
        ((firstVariant.originalPrice - firstVariant.price) /
          firstVariant.originalPrice) *
          100,
      )
    : 0;

  return (
    <article className="plp-product-card">
      <Link
        to={`/productdetails/${product.id}`}
        className="plp-product-card__link"
      >
        <div className="plp-product-card__image">
          <button
            type="button"
            className="plp-product-card__wishlist"
            aria-label={`Add ${product.name} to wishlist`}
          >
            ♡
          </button>
          {firstImage ? (
            <img src={firstImage} alt={product.name} />
          ) : (
            <span aria-hidden="true">📦</span>
          )}
        </div>
      </Link>
      <div className="plp-product-card__content">
        <Link
          to={`/productdetails/${product.id}`}
          className="plp-product-card__link"
        >
          <h2>{product.name}</h2>
          <div className="plp-product-card__rating">
            <span>★ {product.rating}</span>
            <small>({product.reviews})</small>
          </div>
          <div className="plp-product-card__price">
            <strong>
              ₹{firstVariant?.price.toLocaleString("en-IN") ?? "-"}
            </strong>
            {firstVariant && (
              <del>₹{firstVariant.originalPrice.toLocaleString("en-IN")}</del>
            )}
          </div>
          <p className="plp-product-card__discount">
            {discountPercentage}% off
          </p>
          {/* <div className="plp-product-card__features">
            <span>⭐ Assured</span>
            <span>🚚 Fast Delivery</span>
          </div> */}
        </Link>
        <Button onClick={() => console.log(`Add ${product.name} to cart`)}>
          Add to Cart
        </Button>
      </div>
    </article>
  );
}

export default ProductCard;
