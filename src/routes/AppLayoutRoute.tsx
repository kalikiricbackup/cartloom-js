import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import AppLayout from "../layouts/AppLayout/AppLayout";
import { getWishlist } from "../services/productService";
import { setWishlistProductIds } from "../store/slices/wishlistSlice";
import { useAppDispatch, useAppSelector } from "../store/store";

function AppLayoutRoute() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(
    (state) => state.auth.isAuthenticated,
  );

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const controller = new AbortController();

    getWishlist(controller.signal)
      .then((response) => {
        if (controller.signal.aborted) {
          return;
        }

        dispatch(
          setWishlistProductIds(response.items.map((item) => item.product_id)),
        );
      })
      .catch(() => {
        // Keep the current wishlist state if hydration fails; page-level flows
        // surface their own request errors.
      });

    return () => controller.abort();
  }, [dispatch, isAuthenticated]);

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
export default AppLayoutRoute;
