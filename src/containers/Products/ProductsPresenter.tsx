import React from "react";
import PageContainer from "../../components/PageContainer/PageContainer";
import { Product } from "../../types";
import ProductFilters from "../../components/ProductFilters/ProductFilters";
import ProductGrid from "../../components/ProductGrid/ProductGrid";
import "./ProductsPresenter.css";

interface ProductsPresenterProps {
  category: string | undefined;
  products: Product[];
  totalProducts: number;
  productCategories: string[];
  productBrands: string[];
  selectedCategory: string;
  selectedBrands: string[];
  minPrice: number;
  maxPrice: number;
  selectedRating: number | null;
  sortBy: string;
  onCategoryChange: (category: string) => void;
  onBrandsChange: (brands: string[]) => void;
  onPriceChange: (min: number, max: number) => void;
  onRatingChange: (rating: number | null) => void;
  onSortChange: (sort: string) => void;
}

function ProductsPresenter({
  category,
  products,
  totalProducts,
  productCategories,
  productBrands,
  selectedCategory,
  selectedBrands,
  minPrice,
  maxPrice,
  selectedRating,
  sortBy,
  onCategoryChange,
  onBrandsChange,
  onPriceChange,
  onRatingChange,
  onSortChange,
}: ProductsPresenterProps) {
  return (
    <PageContainer>
      <div className="products-layout">
        {/* LEFT FILTERS */}
        <aside className="products-sidebar">
          <ProductFilters
            productCategories={productCategories}
            productBrands={productBrands}
            selectedCategory={selectedCategory}
            selectedBrands={selectedBrands}
            minPrice={minPrice}
            maxPrice={maxPrice}
            selectedRating={selectedRating}
            onCategoryChange={onCategoryChange}
            onBrandsChange={onBrandsChange}
            onPriceChange={onPriceChange}
            onRatingChange={onRatingChange}
          />
        </aside>
        {/* RIGHT CONTENT */}
        <main className="products-content">
          {/* Breadcrumb */}
          <div className="products-breadcrumb">
            <span>Home</span>
            <span>›</span>
            <span>{category}</span>
          </div>
          {/* Category header */}
          <div className="products-header">
            <div>
              <h1>
                {selectedCategory} <span>({totalProducts} Products)</span>
              </h1>
            </div>
            <div className="products-sort">
              <label htmlFor="sortBy">Sort By:</label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(event) => onSortChange(event.target.value)}
              >
                <option value="popularity">Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
              </select>
            </div>
          </div>
          {/* Products */}
          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <h4 className="products-empty-state">
              No item(s) found based on your filter.
            </h4>
          )}
        </main>
      </div>
    </PageContainer>
  );
}

export default ProductsPresenter;
