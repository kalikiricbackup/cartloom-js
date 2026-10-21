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

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayoutRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/products/:category?" element={<Products />} />
          <Route path="/productdetails/:id" element={<ProductDetails />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/profile" element={<MyProfile />} />
            <Route path="/orders" element={<AccountSection />} />
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
