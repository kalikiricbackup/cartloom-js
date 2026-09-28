import { Product, ProductVariant } from "../../../../types";
import "./ProductInformation.css";

interface ProductInformationProps {
  product: Product;
  variant: ProductVariant;
}

function ProductInformation({ product, variant }: ProductInformationProps) {
  const discount = Math.round(
    ((variant.originalPrice - variant.price) / variant.originalPrice) * 100,
  );

  return (
    <div className="product-information">
      <h1>{product.name}</h1>

      <div className="product-information__rating">
        <span>★ {product.rating}</span>

        <span>({product.reviews} Reviews)</span>

        <span className="product-information__assured">✓ Assured</span>
      </div>

      <div className="product-information__price">
        <strong>₹{variant.price.toLocaleString("en-IN")}</strong>

        <del>₹{variant.originalPrice.toLocaleString("en-IN")}</del>

        <span>{discount}% off</span>
      </div>

      <p className="product-information__inclusive">Inclusive of all taxes</p>

      <div className="product-information__stock">
        {variant.stock > 0 ? (
          <>
            <strong>In Stock</strong>
            <span>{variant.stock} items available</span>
          </>
        ) : (
          <strong>Out of Stock</strong>
        )}
      </div>

      <p className="product-information__description">{product.description}</p>
    </div>
  );
}

export default ProductInformation;
