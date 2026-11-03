import { Address } from "../services/addressService";

export const formatAddress = (address: Address): string =>
  [address.street, address.city, address.state]
    .filter(Boolean)
    .filter((part, index, parts) => parts.indexOf(part) === index)
    .join(", ");
