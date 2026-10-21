import { FormEvent, useCallback, useEffect, useState } from "react";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import {
  Address,
  AddressUpdateRequest,
  deleteAddress,
  getAddresses,
  getAddressErrorMessage,
  updateAddress,
} from "../../services/addressService";
import AddressesPresenter from "./AddressesPresenter";

type AddressDraft = AddressUpdateRequest;

const toDraft = (address: Address): AddressDraft => ({
  id: address.id,
  label: address.label,
  address: address.address,
  street: address.street,
  city: address.city,
  state: address.state,
  pin: address.pin,
});

function AddressesContainer() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [draft, setDraft] = useState<AddressDraft | null>(null);
  const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadAddresses = async () => {
      try {
        const result = await getAddresses(controller.signal);
        setAddresses(result);
      } catch (requestError) {
        if (!controller.signal.aborted) {
          setError(getAddressErrorMessage(requestError));
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadAddresses();
    return () => controller.abort();
  }, []);

  const handleEdit = (address: Address) => {
    setError("");
    setDraft(toDraft(address));
  };

  const handleCancelEdit = () => {
    setDraft(null);
    setError("");
  };

  const handleFieldChange = (field: keyof AddressDraft, value: string) => {
    setDraft((current) => (current ? { ...current, [field]: value } : current));
  };

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft || isSaving) {
      return;
    }

    setIsSaving(true);
    setError("");
    try {
      const updatedAddress = await updateAddress(draft);
      setAddresses((current) =>
        current.map((address) =>
          address.id === updatedAddress.id ? updatedAddress : address,
        ),
      );
      setDraft(null);
    } catch (requestError) {
      setError(getAddressErrorMessage(requestError));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCancel = useCallback(() => {
    if (!isDeleting) {
      setAddressToDelete(null);
      setError("");
    }
  }, [isDeleting]);

  const handleDeleteConfirm = async () => {
    if (!addressToDelete || isDeleting) {
      return;
    }

    setIsDeleting(true);
    setError("");
    try {
      await deleteAddress(addressToDelete.id);
      setAddresses((current) =>
        current.filter((address) => address.id !== addressToDelete.id),
      );
      if (draft?.id === addressToDelete.id) {
        setDraft(null);
      }
      setAddressToDelete(null);
    } catch (requestError) {
      setAddressToDelete(null);
      setError(getAddressErrorMessage(requestError));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <AddressesPresenter
        addresses={addresses}
        draft={draft}
        error={error}
        isLoading={isLoading}
        isSaving={isSaving}
        onEdit={handleEdit}
        onCancelEdit={handleCancelEdit}
        onFieldChange={handleFieldChange}
        onUpdate={handleUpdate}
        onDelete={setAddressToDelete}
      />
      <ConfirmDialog
        isOpen={Boolean(addressToDelete)}
        title="Delete address?"
        message={
          <>
            This will permanently delete the {addressToDelete?.label || "saved"}{" "}
            address.
            {isDeleting ? " Deleting…" : ""}
          </>
        }
        confirmLabel={isDeleting ? "Deleting…" : "Delete address"}
        cancelLabel="Keep address"
        onConfirm={() => void handleDeleteConfirm()}
        onCancel={handleDeleteCancel}
      />
    </>
  );
}

export default AddressesContainer;
