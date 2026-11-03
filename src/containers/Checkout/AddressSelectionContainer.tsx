import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Address,
  getAddresses,
  getAddressErrorMessage,
} from "../../services/addressService";
import {
  BuyNowCheckoutItem,
  CheckoutSource,
} from "../../services/orderService";
import AddressSelectionPresenter from "./AddressSelectionPresenter";

function AddressSelectionContainer() {
  const navigate = useNavigate();
  const location = useLocation();
  const checkoutState = location.state as {
    address?: Address;
    source?: CheckoutSource;
    buyNowItem?: BuyNowCheckoutItem;
  } | null;
  const previousAddress = checkoutState?.address;
  const buyNowItem = checkoutState?.buyNowItem;
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(
    previousAddress?.id ?? null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    getAddresses(controller.signal)
      .then(setAddresses)
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted)
          setError(getAddressErrorMessage(requestError));
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
    return () => controller.abort();
  }, []);

  const handleContinue = () => {
    const selectedAddress = addresses.find(
      (address) => address.id === selectedId,
    );
    if (selectedAddress) {
      navigate("/checkout/payment", {
        state: {
          address: selectedAddress,
          source: checkoutState?.source ?? "cart",
          buyNowItem: checkoutState?.buyNowItem,
        },
      });
    }
  };

  const backLink = useMemo(() => {
    if (checkoutState?.source === "product-details" && buyNowItem) {
      return {
        to: `/productdetails/${buyNowItem.parent_id}?variant=${encodeURIComponent(buyNowItem.variant_id)}`,
        label: "← Back to product",
      };
    }
    return { to: "/cart", label: "← Back to cart" };
  }, [
    buyNowItem,
    checkoutState?.source,
  ]);

  return (
    <AddressSelectionPresenter
      addresses={addresses}
      selectedId={selectedId}
      isLoading={isLoading}
      error={error}
      backLinkTo={backLink.to}
      backLinkLabel={backLink.label}
      onSelect={setSelectedId}
      onContinue={handleContinue}
    />
  );
}

export default AddressSelectionContainer;
