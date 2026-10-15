import { useEffect, useState } from "react";
import {
  getWishlist,
  getWishlistErrorMessage,
  WishlistItem,
} from "../../services/productService";
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

  useEffect(() => {
    const controller = new AbortController();

    async function loadWishlist() {
      setIsLoading(true);
      setError("");

      try {
        const response = await getWishlist(controller.signal);
        setWishlistItems(response.items);
        dispatch(
          setWishlistProductIds(response.items.map((item) => item.product_id)),
        );
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
  }, [dispatch]);

  const visibleWishlistItems = wishlistItems.filter((item) =>
    wishlistProductIds.includes(item.product_id),
  );

  return (
    <WishlistPresenter
      items={visibleWishlistItems}
      isLoading={isLoading}
      error={error}
    />
  );
}

export default WishlistContainer;
