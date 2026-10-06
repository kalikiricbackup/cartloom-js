import React, { useEffect, useMemo, useState } from "react";
import { isAxiosError } from "axios";
import { useParams } from "react-router-dom";
import ProductsPresenter from "./ProductsPresenter";
import { Product } from "../../types";
import { getProducts } from "../../services/productService";

function ProductsContainer() {
  const { category } = useParams<{ category?: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const routeCategory = category ?? "All";
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(150000);

  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const [sortBy, setSortBy] = useState("popularity");

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      setIsLoading(true);
      setError("");

      try {
        const response = await getProducts(controller.signal);
        setProducts(response.products);
      } catch (requestError: unknown) {
        if (controller.signal.aborted) {
          return;
        }

        const apiMessage = isAxiosError<{ detail?: string; message?: string }>(
          requestError,
        )
          ? (requestError.response?.data?.detail ??
            requestError.response?.data?.message)
          : undefined;
        setError(
          typeof apiMessage === "string"
            ? apiMessage
            : "Unable to load products. Please try again later.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadProducts();

    return () => controller.abort();
  }, []);

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
      (product) =>
        product.variants[0]?.price >= minPrice &&
        product.variants[0]?.price <= maxPrice,
    );
    // Rating
    if (selectedRating !== null) {
      result = result.filter((product) => product.rating >= selectedRating);
    }
    // Sorting
    if (sortBy === "price-low") {
      result.sort((a, b) => a.variants[0]?.price - b.variants[0]?.price);
    }
    if (sortBy === "price-high") {
      result.sort((a, b) => b.variants[0]?.price - a.variants[0]?.price);
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
      isLoading={isLoading}
      error={error}
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
