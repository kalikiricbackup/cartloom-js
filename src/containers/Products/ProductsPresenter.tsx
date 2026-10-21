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
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  error: string;
  productBrands: string[];
  selectedBrand: string;
  minPrice: number;
  maxPrice: number;
  selectedRating: number | null;
  sortBy: string;
  onBrandChange: (brand: string) => void;
  onPriceChange: (min: number, max: number) => void;
  onRatingChange: (rating: number | null) => void;
  onSortChange: (sort: string) => void;
  onPageChange: (page: number) => void;
  isAuthenticated: boolean;
}

function ProductsPresenter({
  category,
  products,
  totalProducts,
  currentPage,
  totalPages,
  isLoading,
  error,
  productBrands,
  selectedBrand,
  minPrice,
  maxPrice,
  selectedRating,
  sortBy,
  onBrandChange,
  onPriceChange,
  onRatingChange,
  onSortChange,
  onPageChange,
  isAuthenticated,
}: ProductsPresenterProps) {
  const visiblePages: Array<number | "ellipsis-start" | "ellipsis-end"> =
    totalPages <= 5
      ? Array.from({ length: totalPages }, (_, index) => index + 1)
      : currentPage <= 3
        ? [1, 2, 3, 4, "ellipsis-end", totalPages]
        : currentPage >= totalPages - 2
          ? [
              1,
              "ellipsis-start",
              totalPages - 3,
              totalPages - 2,
              totalPages - 1,
              totalPages,
            ]
          : [
              1,
              "ellipsis-start",
              currentPage - 1,
              currentPage,
              currentPage + 1,
              "ellipsis-end",
              totalPages,
            ];

  return (
    <PageContainer>
      <div className="products-layout">
        {/* LEFT FILTERS */}
        <aside className="products-sidebar">
          <ProductFilters
            productBrands={productBrands}
            selectedBrand={selectedBrand}
            minPrice={minPrice}
            maxPrice={maxPrice}
            selectedRating={selectedRating}
            onBrandChange={onBrandChange}
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
                {category ?? "All Products"}{" "}
                <span>({totalProducts} Products)</span>
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
          {isLoading ? (
            <p className="products-status" role="status">
              Loading products…
            </p>
          ) : error ? (
            <p className="products-status products-status--error" role="alert">
              {error}
            </p>
          ) : (
            <>
              {products.length > 0 ? (
                <ProductGrid
                  products={products}
                  columns={4}
                  showWishlist={isAuthenticated}
                />
              ) : (
                <h4 className="products-empty-state">
                  {selectedRating !== null
                    ? "No products found with the selected rating."
                    : "No item(s) found based on your filter."}
                </h4>
              )}
              {totalPages > 1 && (
                <nav className="products-pagination" aria-label="Product pages">
                  <button
                    type="button"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1 || isLoading}
                    aria-label="Previous page"
                  >
                    ‹
                  </button>
                  {visiblePages.map((page) =>
                    typeof page === "number" ? (
                      <button
                        type="button"
                        key={page}
                        onClick={() => onPageChange(page)}
                        disabled={isLoading || page === currentPage}
                        aria-current={page === currentPage ? "page" : undefined}
                        aria-label={`Page ${page}`}
                      >
                        {page}
                      </button>
                    ) : (
                      <span
                        className="products-pagination__ellipsis"
                        key={page}
                        aria-hidden="true"
                      >
                        …
                      </span>
                    ),
                  )}
                  <button
                    type="button"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages || isLoading}
                    aria-label="Next page"
                  >
                    ›
                  </button>
                </nav>
              )}
            </>
          )}
        </main>
      </div>
    </PageContainer>
  );
}

export default ProductsPresenter;
