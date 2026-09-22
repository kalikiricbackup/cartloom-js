import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ProductsPresenter from "./ProductsPresenter";
import { Product } from "../../types";
import { trendingProducts } from "../../services/mockApi";

function ProductsContainer() {
  const { category } = useParams<{ category?: string }>();
  const [products] = useState<Product[]>(trendingProducts);
  const routeCategory = category ?? "All";
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(150000);

  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const [sortBy, setSortBy] = useState("popularity");

  const categoryProducts = useMemo(
    () =>
      routeCategory === "All"
        ? products
        : products.filter((product) => product.category === routeCategory),
    [products, routeCategory],
  );

  const productCategories = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(categoryProducts.map((product) => product.subCategory)),
      ),
    ],
    [categoryProducts],
  );

  const productBrands = useMemo(() => {
    return Array.from(
      new Set(categoryProducts.map((product) => product.brand)),
    );
  }, [categoryProducts]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedBrands([]);
  };

  const filteredProducts = useMemo(() => {
    let result = [...categoryProducts];

    // Subcategory
    if (selectedCategory !== "All") {
      result = result.filter(
        (product) => product.subCategory === selectedCategory,
      );
    }
    // Brand
    if (selectedBrands.length > 0) {
      result = result.filter((product) =>
        selectedBrands.includes(product.brand),
      );
    }
    // Price
    result = result.filter(
      (product) => product.price >= minPrice && product.price <= maxPrice,
    );
    console.log("selected Rating is ", selectedRating, result);

    // Rating
    if (selectedRating !== null) {
      result = result.filter((product) => product.rating >= selectedRating);
    }
    console.log("final list--", result);

    // Sorting
    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    }
    if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    if (sortBy === "popularity") {
      result.sort((a, b) => b.reviews - a.reviews);
    }
    return result;
  }, [
    categoryProducts,
    selectedCategory,
    selectedBrands,
    minPrice,
    maxPrice,
    selectedRating,
    sortBy,
  ]);

  return (
    <ProductsPresenter
      category={category}
      products={filteredProducts}
      totalProducts={filteredProducts.length}
      productCategories={productCategories}
      productBrands={productBrands}
      selectedCategory={selectedCategory}
      selectedBrands={selectedBrands}
      minPrice={minPrice}
      maxPrice={maxPrice}
      selectedRating={selectedRating}
      sortBy={sortBy}
      onCategoryChange={handleCategoryChange}
      onBrandsChange={setSelectedBrands}
      onPriceChange={(min, max) => {
        setMinPrice(min);
        setMaxPrice(max);
      }}
      onRatingChange={setSelectedRating}
      onSortChange={setSortBy}
    />
  );
}

export default ProductsContainer;
