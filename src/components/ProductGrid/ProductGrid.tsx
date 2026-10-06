import type { CSSProperties } from "react";
import { Product } from "../../types";
import ProductCard from "../ProductCard/ProductCard";
import "./ProductGrid.css";

interface ProductGridProps {
  products: Product[];
  columns?: number;
}

function ProductGrid({ products, columns = 3 }: ProductGridProps) {
  return (
    <div
      className="plp-product-grid"
      style={{ "--product-grid-columns": columns } as CSSProperties}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductGrid;
