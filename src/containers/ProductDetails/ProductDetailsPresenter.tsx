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
  isWishlistUpdating: boolean;
  isAddingToCart: boolean;
  isAddedToCart: boolean;
  addToCartError: string;
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
  isWishlistUpdating,
  isAddingToCart,
  isAddedToCart,
  addToCartError,
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
                    aria-pressed={isWishlisted}
                    disabled={isWishlistUpdating}
                  >
                    {isWishlistUpdating
                      ? "Updating wishlist…"
                      : `${isWishlisted ? "♥" : "♡"} ${isWishlisted ? "Remove from" : "Add to"} Wishlist`}
                  </button>
                </div>
              </>
            )}
          </section>

          {/* RIGHT */}
          <section className="product-details__right">
            {displayVariant && (
              <>
                <ProductInformation
                  product={product}
                  variant={displayVariant}
                />

                <ProductVariants
                  product={product}
                  selectedOptions={selectedOptions}
                  onOptionChange={onOptionChange}
                />

                <ProductOffers offers={product.offers} />

                <div className="product-details__purchase">
                  <button
                    type="button"
                    className="product-details__cart-button"
                    onClick={onAddToCart}
                    disabled={
                      !selectedVariant ||
                      selectedVariant.stock === 0 ||
                      isAddingToCart ||
                      isAddedToCart
                    }
                  >
                    {selectedVariant?.stock === 0
                      ? "Out of Stock"
                      : isAddingToCart
                        ? "Adding…"
                        : isAddedToCart
                          ? "Added to Cart"
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
                {addToCartError && (
                  <p className="product-details__cart-error" role="alert">
                    {addToCartError}
                  </p>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </PageContainer>
  );
}

export default ProductDetailsPresenter;
