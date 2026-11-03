import type { CSSProperties } from "react";
import { Product, ProductVariant } from "../../types";
import ProductCard from "../ProductCard/ProductCard";
import "./ProductGrid.css";

interface ProductGridProps {
  products: Product[];
  columns?: number;
  showWishlist?: boolean;
  selectedVariants?: ProductVariant[];
  onAddToCart?: (productId: number, variantId: string) => void;
  addingToCartVariantId?: string | null;
}

function ProductGrid({
  products,
  columns = 3,
  showWishlist = true,
  selectedVariants,
  onAddToCart,
  addingToCartVariantId,
}: ProductGridProps) {
  return (
    <div
      className="plp-product-grid"
      style={{ "--product-grid-columns": columns } as CSSProperties}
    >
      {products.map((product, index) => (
        <ProductCard
          key={`${product.id}-${selectedVariants?.[index]?.variantid ?? "default"}`}
          product={product}
          selectedVariant={selectedVariants?.[index]}
          showWishlist={showWishlist}
          onAddToCart={onAddToCart}
          isAddingToCart={
            Boolean(selectedVariants?.[index]) &&
            addingToCartVariantId === selectedVariants?.[index]?.variantid
          }
        />
      ))}
    </div>
  );
}

export default ProductGrid;
