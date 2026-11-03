import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getCart,
  getCartErrorMessage,
  CartItem,
} from "../../services/cartService";
import { Address } from "../../services/addressService";
import {
  BuyNowCheckoutItem,
  CheckoutSource,
  getOrderErrorMessage,
  placeBuyNowOrder,
  placeOrder,
} from "../../services/orderService";
import PaymentSelectionPresenter, {
  PaymentMethod,
  PaymentMethodOption,
} from "./PaymentSelectionPresenter";

interface CheckoutLocationState {
  address?: Address;
  source?: CheckoutSource;
  buyNowItem?: BuyNowCheckoutItem;
}

const paymentMethods: PaymentMethodOption[] = [
  {
    value: "upi",
    label: "UPI",
    icon: "◉",
    description: "Google Pay, PhonePe, etc.",
  },
  {
    value: "card",
    label: "Credit / Debit Card",
    icon: "▣",
    description: "Visa · Mastercard · RuPay",
  },
  { value: "net-banking", label: "Net Banking", icon: "▤" },
  { value: "cod", label: "Cash on Delivery (COD)", icon: "◷" },
];

function PaymentSelectionContainer() {
  const navigate = useNavigate();
  const location = useLocation();
  const checkoutState = location.state as CheckoutLocationState | null;
  const address = checkoutState?.address;
  const checkoutSource = checkoutState?.source ?? "cart";
  const buyNowItem = checkoutState?.buyNowItem;
  const isBuyNowFlow = checkoutSource === "product-details";
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState("0");
  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");

  useEffect(() => {
    if (!address) {
      navigate("/checkout/address", {
        replace: true,
        state: { source: checkoutSource, buyNowItem },
      });
      return;
    }

    if (isBuyNowFlow) {
      if (!buyNowItem) {
        setError("The item for this purchase could not be found. Please try again.");
        setIsLoading(false);
        return;
      }
      setItems([]);
      setCartTotal(String(buyNowItem.unitPrice * buyNowItem.quantity));
      setIsLoading(false);
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
  }, [address, buyNowItem, checkoutSource, isBuyNowFlow, navigate]);

  const itemCount = isBuyNowFlow
    ? (buyNowItem?.quantity ?? 0)
    : items.reduce((total, item) => total + item.quantity, 0);
  const listPriceTotal = useMemo(
    () =>
      isBuyNowFlow && buyNowItem
        ? buyNowItem.originalPrice * buyNowItem.quantity
        : items.reduce(
            (total, item) => total + item.variant.originalPrice * item.quantity,
            0,
          ),
    [buyNowItem, isBuyNowFlow, items],
  );
  const itemSubtotal = isBuyNowFlow && buyNowItem
    ? buyNowItem.unitPrice * buyNowItem.quantity
    : items.reduce(
        (total, item) =>
          total + (Number(item.unit_price) || item.variant.price) * item.quantity,
        0,
      );
  const total = isBuyNowFlow ? itemSubtotal : Number(cartTotal) || itemSubtotal;
  const discount = Math.max(0, listPriceTotal - itemSubtotal);

  const handlePay = async () => {
    if (
      isPaying ||
      itemCount === 0 ||
      !address ||
      (isBuyNowFlow && !buyNowItem)
    )
      return;
    setIsPaying(true);
    setError("");
    try {
      const order = isBuyNowFlow && buyNowItem
        ? await placeBuyNowOrder(address.id, [
            {
              parent_id: buyNowItem.parent_id,
              variant_id: buyNowItem.variant_id,
              quantity: buyNowItem.quantity,
            },
          ])
        : await placeOrder(address.id);
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
      checkoutSource={checkoutSource}
      buyNowItem={buyNowItem}
      paymentMethods={paymentMethods}
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
