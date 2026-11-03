import { useCallback, useEffect, useState } from "react";
import {
  getWishlist,
  getWishlistErrorMessage,
  WishlistItem,
} from "../../services/productService";
import { addItemToCart, getCartErrorMessage } from "../../services/cartService";
import { setWishlistProductIds } from "../../store/slices/wishlistSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";
import WishlistPresenter from "./WishlistPresenter";

function WishlistContainer() {
  const dispatch = useAppDispatch();
  const wishlistProductIds = useAppSelector(
    (state) => state.wishlist.productIds,
  );
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingToCartVariantId, setAddingToCartVariantId] = useState<
    string | null
  >(null);
  const [cartActionError, setCartActionError] = useState("");

  const refreshWishlist = useCallback(
    async (signal?: AbortSignal) => {
      const response = await getWishlist(signal);
      setWishlistItems(response.items);
      dispatch(
        setWishlistProductIds(response.items.map((item) => item.product_id)),
      );
    },
    [dispatch],
  );

  useEffect(() => {
    const controller = new AbortController();

    async function loadWishlist() {
      setIsLoading(true);
      setError("");

      try {
        await refreshWishlist(controller.signal);
      } catch (requestError: unknown) {
        if (controller.signal.aborted) {
          return;
        }

        setError(getWishlistErrorMessage(requestError));
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadWishlist();

    return () => controller.abort();
  }, [refreshWishlist]);

  const handleAddToCart = async (productId: number, variantId: string) => {
    if (addingToCartVariantId) return;

    setAddingToCartVariantId(variantId);
    setCartActionError("");

    try {
      await addItemToCart({
        parentId: productId,
        variant_id: variantId,
        quantity: 1,
      });
    } catch (requestError: unknown) {
      setCartActionError(getCartErrorMessage(requestError));
      setAddingToCartVariantId(null);
      return;
    }

    try {
      await refreshWishlist();
    } catch (requestError: unknown) {
      setCartActionError(
        `Added to cart, but ${getWishlistErrorMessage(requestError)}`,
      );
    } finally {
      setAddingToCartVariantId(null);
    }
  };

  const visibleWishlistItems = wishlistItems.filter((item) =>
    wishlistProductIds.includes(item.product_id),
  );

  return (
    <WishlistPresenter
      items={visibleWishlistItems}
      isLoading={isLoading}
      error={error}
      onAddToCart={handleAddToCart}
      addingToCartVariantId={addingToCartVariantId}
      cartActionError={cartActionError}
    />
  );
}

export default WishlistContainer;
