import { useLocation } from "react-router-dom";
import { Order } from "../../services/orderService";
import OrderSuccessPresenter from "./OrderSuccessPresenter";

function OrderSuccessContainer() {
  const location = useLocation();
  const order = (location.state as { order?: Order } | null)?.order;

  return <OrderSuccessPresenter orderId={order?.id} />;
}

export default OrderSuccessContainer;