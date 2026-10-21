import React, { useEffect, useMemo, useState } from "react";
import { isAxiosError } from "axios";
import { useParams } from "react-router-dom";
import ProductsPresenter from "./ProductsPresenter";
import { Product } from "../../types";
import { getProducts } from "../../services/productService";
import { useAppSelector } from "../../store/store";

function ProductsContainer() {
  const { category } = useParams<{ category?: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const routeCategory = category;
  const [selectedBrand, setSelectedBrand] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(150000);
  const [sortBy, setSortBy] = useState("popularity");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [brandOptions, setBrandOptions] = useState<{
    category: string | undefined;
    values: string[];
  }>({ category: routeCategory, values: [] });

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    setSelectedBrand("");
    setMinPrice(0);
    setMaxPrice(150000);
    setSortBy("popularity");
    setCurrentPage(1);
    setSelectedRating(null);
  }, [routeCategory]);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setError("");

    async function loadProducts() {
      try {
        const params = {
          ...(routeCategory ? { category: routeCategory } : {}),
          ...(selectedBrand ? { brand: selectedBrand } : {}),
          ...(selectedRating !== null ? { rating: selectedRating } : {}),
          ...(minPrice > 0 ? { minPrice } : {}),
          ...(maxPrice < 150000 ? { maxPrice } : {}),
          ...(currentPage > 1 ? { page: currentPage } : {}),
          ...(currentPage > 1 ? { page_size: 20 } : {}),
          ...(sortBy !== "popularity" ? { sort: sortBy } : {}),
        };
        const response = await getProducts(params, controller.signal);
        setProducts(response.products);
        setTotalProducts(response.count);
        setTotalPages(
          response.totalPages ??
            Math.max(1, Math.ceil(response.count / (response.pageSize ?? 20))),
        );
        setCurrentPage(response.page ?? currentPage);
        const responseBrands = response.products.map(
          (product) => product.brand,
        );
        setBrandOptions((current) => {
          if (current.category !== routeCategory) {
            return {
              category: routeCategory,
              values: Array.from(new Set(responseBrands)),
            };
          }
          if (selectedBrand) {
            return current;
          }
          return {
            ...current,
            values: Array.from(new Set([...current.values, ...responseBrands])),
          };
        });
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

    const requestTimeout = window.setTimeout(() => {
      void loadProducts();
    }, 300);

    return () => {
      window.clearTimeout(requestTimeout);
      controller.abort();
    };
  }, [
    routeCategory,
    selectedBrand,
    selectedRating,
    minPrice,
    maxPrice,
    sortBy,
    currentPage,
  ]);

  const productBrands = useMemo(() => {
    const brands = new Set(
      brandOptions.category === routeCategory ? brandOptions.values : [],
    );
    if (selectedBrand) {
      brands.add(selectedBrand);
    }
    return Array.from(brands);
  }, [brandOptions, routeCategory, selectedBrand]);

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    setCurrentPage(1);
  };

  const handlePriceChange = (min: number, max: number) => {
    setMinPrice(min);
    setMaxPrice(max);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  const handleRatingChange = (rating: number | null) => {
    setSelectedRating(rating);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  };

  return (
    <ProductsPresenter
      category={category}
      products={products}
      totalProducts={totalProducts}
      currentPage={currentPage}
      totalPages={totalPages}
      isLoading={isLoading}
      error={error}
      productBrands={productBrands}
      selectedBrand={selectedBrand}
      minPrice={minPrice}
      maxPrice={maxPrice}
      selectedRating={selectedRating}
      sortBy={sortBy}
      onBrandChange={handleBrandChange}
      onPriceChange={handlePriceChange}
      onRatingChange={handleRatingChange}
      onSortChange={handleSortChange}
      onPageChange={handlePageChange}
      isAuthenticated={isAuthenticated}
    />
  );
}

export default ProductsContainer;
