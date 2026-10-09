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
