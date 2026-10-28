import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Address,
  getAddresses,
  getAddressErrorMessage,
} from "../../services/addressService";
import AddressSelectionPresenter from "./AddressSelectionPresenter";

function AddressSelectionContainer() {
  const navigate = useNavigate();
  const location = useLocation();
  const previousAddress = (location.state as { address?: Address } | null)
    ?.address;
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
      navigate("/checkout/payment", { state: { address: selectedAddress } });
    }
  };

  return (
    <AddressSelectionPresenter
      addresses={addresses}
      selectedId={selectedId}
      isLoading={isLoading}
      error={error}
      onSelect={setSelectedId}
      onContinue={handleContinue}
    />
  );
}

export default AddressSelectionContainer;
