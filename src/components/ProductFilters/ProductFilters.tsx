import "./ProductFilters.css";

interface ProductFiltersProps {
  productBrands: string[];
  selectedBrand: string;
  minPrice: number;
  maxPrice: number;
  selectedRating: number | null;
  onBrandChange: (brand: string) => void;
  onPriceChange: (min: number, max: number) => void;
  onRatingChange: (rating: number | null) => void;
}

function ProductFilters({
  productBrands,
  selectedBrand,
  minPrice,
  maxPrice,
  selectedRating,
  onBrandChange,
  onPriceChange,
  onRatingChange,
}: ProductFiltersProps) {
  return (
    <div className="product-filters">
      <h2>Filters</h2>

      {/* Brand */}
      <section className="filter-section">
        <h3>Brand</h3>
        <select
          value={selectedBrand}
          onChange={(event) => onBrandChange(event.target.value)}
        >
          <option value="">All brands</option>
          {productBrands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </section>

      {/* Rating */}
      <section className="filter-section">
        <h3>Rating</h3>
        {[5, 4, 3, 2, 1].map((rating) => (
          <label key={rating} className="filter-rating">
            <input
              type="radio"
              name="product-rating"
              checked={selectedRating === rating}
              onChange={() => onRatingChange(rating)}
            />
            <span>{rating}★ &amp; up</span>
          </label>
        ))}
        {selectedRating !== null && (
          <button
            type="button"
            className="clear-rating"
            onClick={() => onRatingChange(null)}
          >
            Clear rating
          </button>
        )}
      </section>

      {/* Price */}
      <section className="filter-section">
        <h3>Price Range</h3>
        <div className="price-values">
          <span>₹{minPrice.toLocaleString("en-IN")}</span>
          <span>₹{maxPrice.toLocaleString("en-IN")}</span>
        </div>

        <label className="minimum-price">
          Minimum price
          <input
            type="number"
            min="0"
            max={maxPrice}
            value={minPrice}
            onChange={(event) =>
              onPriceChange(
                Math.min(Number(event.target.value), maxPrice),
                maxPrice,
              )
            }
          />
        </label>
        <input
          type="range"
          min={minPrice}
          max="150000"
          step="1000"
          value={maxPrice}
          onChange={(event) =>
            onPriceChange(minPrice, Number(event.target.value))
          }
        />
      </section>
    </div>
  );
}

export default ProductFilters;
