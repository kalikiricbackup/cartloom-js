import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import ProductDetailsPresenter from "./ProductDetailsPresenter";
import { trendingProducts } from "../../services/mockApi";

function ProductDetailsContainer() {
  const { id } = useParams<{ id: string }>();

  const product = trendingProducts.find((item) => item.id === Number(id));
  console.log("id and product", id, product);

  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >(() => {
    if (!product?.variants.length) {
      return {};
    }

    const firstVariant = product.variants[0];

    return firstVariant.options.reduce(
      (result, option) => ({
        ...result,
        [option.type]: option.value,
      }),
      {} as Record<string, string>,
    );
  });

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const [isWishlisted, setIsWishlisted] = useState(false);

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

  if (!product) {
    return (
      <div className="product-details-not-found">
        <h1>Product Not Found</h1>
        <p>The product you are looking for does not exist.</p>
      </div>
    );
  }

  const handleOptionChange = (type: string, value: string) => {
    setSelectedOptions((current) => ({
      ...current,
      [type]: value,
    }));

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
