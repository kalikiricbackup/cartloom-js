import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Product, ProductVariant } from "../../types";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import "./ProductCard.css";
import Button from "../Button/Button";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../store/slices/wishlistSlice";
import {
  addProductToWishlist,
  getWishlistErrorMessage,
  removeProductFromWishlist,
} from "../../services/productService";

interface ProductCardProps {
  product: Product;
  selectedVariant?: ProductVariant;
  showWishlist?: boolean;
}

function ProductCard({
  product,
  selectedVariant,
  showWishlist = true,
}: ProductCardProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isWishlisted = useAppSelector((state) =>
    state.wishlist.productIds.includes(product.id),
  );
  const [isUpdatingWishlist, setIsUpdatingWishlist] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [wishlistError, setWishlistError] = useState("");
  const firstVariant = product.variants[0];
  const displayVariant = selectedVariant ?? firstVariant;
  const firstImage = displayVariant?.images[0];
  const discountPercentage = displayVariant
    ? Math.round(
        ((displayVariant.originalPrice - displayVariant.price) /
          displayVariant.originalPrice) *
          100,
      )
    : 0;

  const closeLoginDialog = useCallback(() => {
    setIsLoginDialogOpen(false);
  }, []);

  const goToLogin = useCallback(() => {
    closeLoginDialog();
    navigate("/login");
  }, [closeLoginDialog, navigate]);

  const handleWishlistClick = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setWishlistError("");

    if (!isAuthenticated) {
      setIsLoginDialogOpen(true);
      return;
    }

    if (isUpdatingWishlist || (!isWishlisted && !displayVariant)) {
      return;
    }

    setIsUpdatingWishlist(true);

    try {
      if (isWishlisted) {
        await removeProductFromWishlist(product.id);
        dispatch(removeFromWishlist(product.id));
      } else {
        await addProductToWishlist({
          product_id: product.id,
          variant_id: displayVariant.variantid,
        });
        dispatch(addToWishlist(product.id));
      }
    } catch (error: unknown) {
      setWishlistError(getWishlistErrorMessage(error));
    } finally {
      setIsUpdatingWishlist(false);
    }
  };

  return (
    <article className="plp-product-card">
      <div className="plp-product-card__image">
        <Link
          to={`/productdetails/${product.id}`}
          className="plp-product-card__image-link"
          aria-label={`View ${product.name}`}
        >
          {firstImage ? (
            <img src={firstImage} alt={product.name} />
          ) : (
            <span aria-hidden="true">📦</span>
          )}
        </Link>
        {showWishlist && (
          <button
            type="button"
            className={`plp-product-card__wishlist${isWishlisted ? " plp-product-card__wishlist--active" : ""}`}
            aria-label={`${isWishlisted ? "Remove" : "Add"} ${product.name} ${isWishlisted ? "from" : "to"} wishlist`}
            aria-pressed={isWishlisted}
            disabled={isUpdatingWishlist || (!isWishlisted && !displayVariant)}
            onClick={handleWishlistClick}
          >
            {isUpdatingWishlist ? "…" : isWishlisted ? "♥" : "♡"}
          </button>
        )}
      </div>
      <div className="plp-product-card__content">
        <Link
          to={`/productdetails/${product.id}`}
          className="plp-product-card__link"
        >
          <h2>{product.name}</h2>
          <div className="plp-product-card__rating">
            <span>★ {product.rating}</span>
            <small>({product.reviews})</small>
          </div>
          <div className="plp-product-card__price">
            <strong>
              ₹{displayVariant?.price.toLocaleString("en-IN") ?? "-"}
            </strong>
            {displayVariant && (
              <del>₹{displayVariant.originalPrice.toLocaleString("en-IN")}</del>
            )}
          </div>
          <p className="plp-product-card__discount">
            {discountPercentage}% off
          </p>
          {selectedVariant && (
            <p className="plp-product-card__variant">
              {selectedVariant.options
                .map((option) => `${option.label}: ${option.value}`)
                .join(" · ")}
            </p>
          )}
          {/* <div className="plp-product-card__features">
            <span>⭐ Assured</span>
            <span>🚚 Fast Delivery</span>
          </div> */}
        </Link>
        <Button onClick={() => console.log(`Add ${product.name} to cart`)}>
          Add to Cart
        </Button>
        {showWishlist && wishlistError && (
          <p className="plp-product-card__wishlist-error" role="alert">
            {wishlistError}
          </p>
        )}
      </div>
      {showWishlist && (
        <ConfirmDialog
          isOpen={isLoginDialogOpen}
          title="Sign in to save this item"
          message={`Please log in first to add ${product.name} to your wishlist.`}
          cancelLabel="Maybe later"
          confirmLabel="Go to login"
          onCancel={closeLoginDialog}
          onConfirm={goToLogin}
        />
      )}
    </article>
  );
}

export default ProductCard;
