import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home/Home";
import NotFound from "../pages/NotFound/NotFound";
import Products from "../pages/Products/Products";
import Wishlist from "../pages/Wishlist/Wishlist";
import AppLayoutRoute from "./AppLayoutRoute";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import Register from "../pages/Register/Register";
import Login from "../pages/Login/Login";
import ProtectedRoute from "./ProtectedRoute";
import AccountSection from "../pages/Account/AccountSection";
import MyProfile from "../pages/MyProfile/MyProfile";
import Addresses from "../pages/Addresses/Addresses";
import AddAddress from "../pages/Addresses/AddAddress";
import Cart from "../pages/Cart/Cart";
import MyOrdersContainer from "../containers/Orders/MyOrdersContainer";
import AddressSelectionContainer from "../containers/Checkout/AddressSelectionContainer";
import PaymentSelectionContainer from "../containers/Checkout/PaymentSelectionContainer";
import OrderSuccessContainer from "../containers/Checkout/OrderSuccessContainer";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayoutRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/products/:category?" element={<Products />} />
          <Route path="/productdetails/:id" element={<ProductDetails />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/profile" element={<MyProfile />} />
            <Route path="/orders" element={<MyOrdersContainer />} />
            <Route
              path="/checkout/address"
              element={<AddressSelectionContainer />}
            />
            <Route
              path="/checkout/payment"
              element={<PaymentSelectionContainer />}
            />
            <Route path="/order-success" element={<OrderSuccessContainer />} />
            <Route path="/addresses" element={<Addresses />} />
            <Route path="/addresses/new" element={<AddAddress />} />
          </Route>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
