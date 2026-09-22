import { productRating } from "../../services/mockApi";
import "./ProductFilters.css";

interface ProductFiltersProps {
  productCategories: string[];
  productBrands: string[];
  selectedCategory: string;
  selectedBrands: string[];
  minPrice: number;
  maxPrice: number;
  selectedRating: number | null;
  onCategoryChange: (category: string) => void;
  onBrandsChange: (brands: string[]) => void;
  onPriceChange: (min: number, max: number) => void;
  onRatingChange: (rating: number | null) => void;
}

function ProductFilters({
  productCategories,
  productBrands,
  selectedCategory,
  selectedBrands,
  minPrice,
  maxPrice,
  selectedRating,
  onCategoryChange,
  onBrandsChange,
  onPriceChange,
  onRatingChange,
}: ProductFiltersProps) {
  const handleBrandChange = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      onBrandsChange(selectedBrands.filter((item) => item !== brand));
    } else {
      onBrandsChange([...selectedBrands, brand]);
    }
  };

  return (
    <div className="product-filters">
      <h2>Filters</h2>

      {/* Category */}
      <section className="filter-section">
        <h3>Category</h3>
        <select
          value={selectedCategory}
          onChange={(event) => onCategoryChange(event.target.value)}
        >
          {productCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </section>

      {/* Brand */}
      <section className="filter-section">
        <h3>Brand</h3>
        {productBrands.map((brand) => (
          <label key={brand} className="filter-checkbox">
            <input
              type="checkbox"
              checked={selectedBrands.includes(brand)}
              onChange={() => handleBrandChange(brand)}
            />
            <span>{brand}</span>
          </label>
        ))}
      </section>

      {/* Price */}
      <section className="filter-section">
        <h3>Price Range</h3>
        <div className="price-values">
          <span>₹{minPrice.toLocaleString("en-IN")}</span>
          <span>₹{maxPrice.toLocaleString("en-IN")}</span>
        </div>

        <input
          type="range"
          min="0"
          max="150000"
          step="1000"
          value={maxPrice}
          onChange={(event) =>
            onPriceChange(minPrice, Number(event.target.value))
          }
        />
      </section>

      {/* Rating */}
      <section className="filter-section">
        <h3>Rating</h3>
        {productRating.map((rating) => (
          <label key={rating} className="filter-rating">
            <input
              type="radio"
              name="rating"
              checked={selectedRating === rating}
              onChange={() => onRatingChange(rating)}
            />
            <span>
              {"★".repeat(rating)}
              {"☆".repeat(5 - rating)}
            </span>
            <small>& up</small>
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
    </div>
  );
}

export default ProductFilters;
