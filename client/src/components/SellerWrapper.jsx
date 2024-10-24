import React from "react";
import { Routes, Route, useParams, Navigate } from "react-router-dom";
import useSellerIdByName from "../hooks/useSellerIdByName"; // Adjust this import path as needed

// Import all your components here
import Home from "../pages/Home";
import Shops from "../pages/Shops";
import Card from "../pages/Card";
import Details from "../pages/Details";
import Shipping from "../pages/Shipping";
import CategoryShops from "../pages/CategoryShop";
import SearchProducts from "../pages/SearchProducts";
import Payment from "../pages/Payment";
import Dashboard from "../pages/Dashboard";
import ProtectUser from "../utils/ProtectUser";
import Index from "../components/dashboard/Index";
import Orders from "../components/dashboard/Orders";
import Wishlist from "../components/dashboard/Wishlist";
import ChangePassword from "../components/dashboard/ChangePassword";
import Order from "../components/dashboard/Order";
import Chat from "../components/dashboard/Chat";
import ConfirmOrder from "../pages/ConfirmOrder";
import StaticPage from "../components/StaticPage";
import Contact from "../pages/Contact";

const SellerWrapper = () => {
  const { sellerName } = useParams();
  const { sellerId, loading, error } = useSellerIdByName(sellerName);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!sellerId) {
    return <Navigate to="/not-found" />;
  }

  return (
    <Routes>
      <Route path="/" element={<Home sellerId={sellerId} />} />
      <Route path="/shops" element={<Shops sellerId={sellerId} />} />
      <Route path="/products" element={<CategoryShops sellerId={sellerId} />} />
      <Route
        path="/products/search"
        element={<SearchProducts sellerId={sellerId} />}
      />
      <Route path="/card" element={<Card sellerId={sellerId} />} />
      <Route
        path="/order/confirm"
        element={<ConfirmOrder sellerId={sellerId} />}
      />
      <Route path="/shipping" element={<Shipping sellerId={sellerId} />} />
      <Route path="/payment" element={<Payment sellerId={sellerId} />} />
      <Route
        path="/product/details/:slug"
        element={<Details sellerId={sellerId} />}
      />
      <Route
        path="/page/:pageName"
        element={<StaticPage sellerId={sellerId} />}
      />
      <Route path="/contact" element={<Contact sellerId={sellerId} />} />
      <Route path="/dashboard" element={<ProtectUser sellerId={sellerId} />}>
        <Route path="" element={<Dashboard sellerId={sellerId} />}>
          <Route path="" element={<Index sellerId={sellerId} />} />
          <Route path="my-orders" element={<Orders sellerId={sellerId} />} />
          <Route
            path="my-wishlist"
            element={<Wishlist sellerId={sellerId} />}
          />
          <Route
            path="order/details/:orderId"
            element={<Order sellerId={sellerId} />}
          />
          <Route
            path="change-password"
            element={<ChangePassword sellerId={sellerId} />}
          />
          <Route path="chat" element={<Chat sellerId={sellerId} />} />
          <Route
            path="chat/:chatSellerId"
            element={<Chat sellerId={sellerId} />}
          />
        </Route>
      </Route>
    </Routes>
  );
};

export default SellerWrapper;
