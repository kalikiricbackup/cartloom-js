import { isAxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import PageContainer from "../../components/PageContainer/PageContainer";
import { getProductById } from "../../services/productService";
import { Product } from "../../types";
import ProductDetailsPresenter from "./ProductDetailsPresenter";

function ProductDetailsContainer() {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProduct() {
      setProduct(null);
      setSelectedOptions({});
      setSelectedImageIndex(0);
      setError("");

      if (!id || !Number.isInteger(productId)) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const response = await getProductById(productId, controller.signal);
        setProduct(response);
      } catch (requestError: unknown) {
        if (controller.signal.aborted) {
          return;
        }

        const apiMessage = isAxiosError<{
          detail?: string;
          message?: string;
        }>(requestError)
          ? (requestError.response?.data?.detail ??
            requestError.response?.data?.message)
          : undefined;

        setError(
          typeof apiMessage === "string"
            ? apiMessage
            : "Unable to load this product. Please try again later.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadProduct();

    return () => controller.abort();
  }, [id, productId]);

  const selectedVariant = useMemo(() => {
    if (!product) {
      return undefined;
    }

    return product.variants.find((variant) =>
      variant.options.every(
        (option) => selectedOptions[option.type] === option.value,
      ),
    );
  }, [product, selectedOptions]);

  if (isLoading) {
    return (
      <PageContainer>
        <p role="status">Loading product...</p>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="product-details-not-found" role="alert">
          <h1>Unable to Load Product</h1>
          <p>{error}</p>
        </div>
      </PageContainer>
    );
  }

  if (!product) {
    return (
      <PageContainer>
        <div className="product-details-not-found">
          <h1>Product Not Found</h1>
          <p>The product you are looking for does not exist.</p>
        </div>
      </PageContainer>
    );
  }

  const handleOptionChange = (type: string, value: string) => {
    setSelectedOptions((current) => {
      if (current[type] === value) {
        const nextOptions = { ...current };
        delete nextOptions[type];
        return nextOptions;
      }

      return {
        ...current,
        [type]: value,
      };
    });

    setSelectedImageIndex(0);
  };

  const handleAddToCart = () => {
    console.log("Add to Cart", {
      product,
      selectedVariant,
    });
  };

  const handleBuyNow = () => {
    console.log("Buy Now", {
      product,
      selectedVariant,
    });
  };

  const handleShare = async () => {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: product.description,
          url,
        });

        return;
      }

      await navigator.clipboard.writeText(url);

      console.log("Product URL copied to clipboard");
    } catch (error) {
      console.error("Unable to share product", error);
    }
  };

  return (
    <ProductDetailsPresenter
      product={product}
      selectedVariant={selectedVariant}
      selectedOptions={selectedOptions}
      selectedImageIndex={selectedImageIndex}
      isWishlisted={isWishlisted}
      onOptionChange={handleOptionChange}
      onImageChange={setSelectedImageIndex}
      onWishlistChange={() => setIsWishlisted((current) => !current)}
      onShare={handleShare}
      onAddToCart={handleAddToCart}
      onBuyNow={handleBuyNow}
    />
  );
}

export default ProductDetailsContainer;
