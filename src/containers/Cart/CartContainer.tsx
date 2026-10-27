import { useCallback, useEffect, useRef, useState } from "react";
import {
  CartItem,
  getCart,
  getCartErrorMessage,
  removeCartItem,
  updateCartItemQuantity,
} from "../../services/cartService";
import CartPresenter from "./CartPresenter";

function CartContainer() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState("0");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [itemToRemove, setItemToRemove] = useState<CartItem | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [updatingItemIds, setUpdatingItemIds] = useState<Set<number>>(
    () => new Set(),
  );
  const updatingItemIdsRef = useRef(new Set<number>());
  const [reloadKey, setReloadKey] = useState(0);

  const retryLoading = useCallback(() => {
    setReloadKey((key) => key + 1);
  }, []);

  const handleQuantityChange = async (item: CartItem, quantity: number) => {
    const boundedQuantity = Math.min(
      item.variant.stock,
      Math.max(1, quantity),
    );
    if (
      boundedQuantity === item.quantity ||
      updatingItemIdsRef.current.has(item.item_id)
    ) {
      return;
    }

    updatingItemIdsRef.current.add(item.item_id);
    setUpdatingItemIds(new Set(updatingItemIdsRef.current));
    setActionError("");

    try {
      const response = await updateCartItemQuantity(item.item_id, {
        quantity: boundedQuantity,
      });
      setItems(response.items);
      setCartTotal(response.cart_total);
    } catch (requestError: unknown) {
      setActionError(getCartErrorMessage(requestError));
    } finally {
      updatingItemIdsRef.current.delete(item.item_id);
      setUpdatingItemIds(new Set(updatingItemIdsRef.current));
    }
  };

  const handleRemoveRequest = (item: CartItem) => {
    if (!updatingItemIdsRef.current.has(item.item_id)) {
      setActionError("");
      setItemToRemove(item);
    }
  };

  const handleRemoveCancel = useCallback(() => {
    if (!isRemoving) {
      setItemToRemove(null);
    }
  }, [isRemoving]);

  const handleRemoveConfirm = async () => {
    if (!itemToRemove || isRemoving) {
      return;
    }

    const itemId = itemToRemove.item_id;
    setIsRemoving(true);
    setActionError("");
    updatingItemIdsRef.current.add(itemId);
    setUpdatingItemIds(new Set(updatingItemIdsRef.current));

    try {
      const response = await removeCartItem(itemId);
      setItems(response.items);
      setCartTotal(response.cart_total);
      setItemToRemove(null);
    } catch (requestError: unknown) {
      setActionError(getCartErrorMessage(requestError));
      setItemToRemove(null);
    } finally {
      updatingItemIdsRef.current.delete(itemId);
      setUpdatingItemIds(new Set(updatingItemIdsRef.current));
      setIsRemoving(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    async function loadCart() {
      setIsLoading(true);
      setError("");

      try {
        const response = await getCart(controller.signal);
        setItems(response.items);
        setCartTotal(response.cart_total);
      } catch (requestError: unknown) {
        if (!controller.signal.aborted) {
          setError(getCartErrorMessage(requestError));
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadCart();
    return () => controller.abort();
  }, [reloadKey]);

  return (
    <CartPresenter
      items={items}
      cartTotal={cartTotal}
      isLoading={isLoading}
      error={error}
      actionError={actionError}
      updatingItemIds={updatingItemIds}
      itemToRemove={itemToRemove}
      isRemoving={isRemoving}
      onRetry={retryLoading}
      onQuantityChange={handleQuantityChange}
      onRemoveRequest={handleRemoveRequest}
      onRemoveConfirm={() => void handleRemoveConfirm()}
      onRemoveCancel={handleRemoveCancel}
    />
  );
}

export default CartContainer;
