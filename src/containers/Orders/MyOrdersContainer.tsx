import { useEffect, useState } from "react";
import {
  getOrderErrorMessage,
  getOrders,
  Order,
} from "../../services/orderService";
import MyOrdersPresenter from "./MyOrdersPresenter";

function MyOrdersContainer() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    getOrders(controller.signal)
      .then(setOrders)
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted)
          setError(getOrderErrorMessage(requestError));
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
    return () => controller.abort();
  }, []);

  return (
    <MyOrdersPresenter orders={orders} isLoading={isLoading} error={error} />
  );
}

export default MyOrdersContainer;
