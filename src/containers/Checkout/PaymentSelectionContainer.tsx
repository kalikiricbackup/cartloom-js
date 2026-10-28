import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getCart,
  getCartErrorMessage,
  CartItem,
} from "../../services/cartService";
import { Address } from "../../services/addressService";
import { getOrderErrorMessage, placeOrder } from "../../services/orderService";
import PaymentSelectionPresenter, {
  PaymentMethod,
} from "./PaymentSelectionPresenter";

interface CheckoutLocationState {
  address?: Address;
}

function PaymentSelectionContainer() {
  const navigate = useNavigate();
  const location = useLocation();
  const address = (location.state as CheckoutLocationState | null)?.address;
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState("0");
  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");

  useEffect(() => {
    if (!address) {
      navigate("/checkout/address", { replace: true });
      return;
    }
    const controller = new AbortController();
    getCart(controller.signal)
      .then((cart) => {
        setItems(cart.items);
        setCartTotal(cart.cart_total);
      })
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted)
          setError(getCartErrorMessage(requestError));
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
    return () => controller.abort();
  }, [address, navigate]);

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const listPriceTotal = useMemo(
    () =>
      items.reduce(
        (total, item) => total + item.variant.originalPrice * item.quantity,
        0,
      ),
    [items],
  );
  const itemSubtotal = items.reduce(
    (total, item) =>
      total + (Number(item.unit_price) || item.variant.price) * item.quantity,
    0,
  );
  const total = Number(cartTotal) || itemSubtotal;
  const discount = Math.max(0, listPriceTotal - itemSubtotal);

  const handlePay = async () => {
    if (isPaying || items.length === 0) return;
    setIsPaying(true);
    setError("");
    try {
      const order = await placeOrder();
      navigate("/order-success", { replace: true, state: { order } });
    } catch (requestError: unknown) {
      setError(getOrderErrorMessage(requestError));
      setIsPaying(false);
    }
  };

  if (!address) return null;

  return (
    <PaymentSelectionPresenter
      address={address}
      itemCount={itemCount}
      listPriceTotal={listPriceTotal}
      itemSubtotal={itemSubtotal}
      total={total}
      discount={discount}
      isLoading={isLoading}
      isPaying={isPaying}
      error={error}
      paymentMethod={paymentMethod}
      onPaymentMethodChange={setPaymentMethod}
      onPay={() => void handlePay()}
    />
  );
}

export default PaymentSelectionContainer;
