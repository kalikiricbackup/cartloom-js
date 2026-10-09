import PageContainer from "../../components/PageContainer/PageContainer";
import ProductInformation from "./components/ProductInformation/ProductInformation";
import ProductOffers from "./components/ProductOffers/ProductOffers";
import ProductVariants from "./components/ProductVariants/ProductVariants";
import ProductGallery from "./components/ProductGallery/ProductGallery";
import { Product, ProductVariant } from "../../types";

import "./ProductDetailsPresenter.css";

interface ProductDetailsPresenterProps {
  product: Product;
  selectedVariant: ProductVariant | undefined;
  selectedOptions: Record<string, string>;
  selectedImageIndex: number;
  isWishlisted: boolean;
  onOptionChange: (type: string, value: string) => void;
  onImageChange: (index: number) => void;
  onWishlistChange: () => void;
  onShare: () => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
}

function ProductDetailsPresenter({
  product,
  selectedVariant,
  selectedOptions,
  selectedImageIndex,
  isWishlisted,
  onOptionChange,
  onImageChange,
  onWishlistChange,
  onShare,
  onAddToCart,
  onBuyNow,
}: ProductDetailsPresenterProps) {
  const displayVariant =
    selectedVariant ??
    product.variants.find((variant) => variant.stock > 0) ??
    product.variants[0];

  return (
    <PageContainer>
      <div className="product-details">
        {/* Breadcrumb */}
        <div className="product-details__breadcrumb">
          <span>Home</span>
          <span>›</span>
          <span>{product.category}</span>
          <span>›</span>
          <span>{product.brand}</span>
          <span>›</span>
          <span>{product.name}</span>
        </div>

        {/* Main PDP */}
        <div className="product-details__main">
          {/* LEFT */}
          <section className="product-details__left">
            {displayVariant && (
              <>
                <ProductGallery
                  images={displayVariant.images}
                  selectedImageIndex={selectedImageIndex}
                  onImageChange={onImageChange}
                />

                <div className="product-details__actions">
                  <button type="button" onClick={onShare}>
                    ↗ Share
                  </button>
                  <button
                    type="button"
                    className={isWishlisted ? "wishlist-active" : ""}
                    onClick={onWishlistChange}
                  >
                    {isWishlisted ? "♥" : "♡"} Add to Wishlist
                  </button>
                </div>
              </>
            )}
          </section>

          {/* RIGHT */}
          <section className="product-details__right">
            <ProductVariants
              product={product}
              selectedOptions={selectedOptions}
              onOptionChange={onOptionChange}
            />

            {displayVariant && (
              <>
                <ProductInformation
                  product={product}
                  variant={displayVariant}
                />
                <ProductOffers offers={product.offers} />

                <div className="product-details__purchase">
                  <button
                    type="button"
                    className="product-details__cart-button"
                    onClick={onAddToCart}
                    disabled={!selectedVariant || selectedVariant.stock === 0}
                  >
                    {selectedVariant?.stock === 0
                      ? "Out of Stock"
                      : "Add to Cart"}
                  </button>
                  <button
                    type="button"
                    className="product-details__buy-button"
                    onClick={onBuyNow}
                    disabled={!selectedVariant || selectedVariant.stock === 0}
                  >
                    Buy Now
                  </button>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </PageContainer>
  );
}

export default ProductDetailsPresenter;
