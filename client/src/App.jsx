import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useParams,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { get_category } from "./store/reducers/homeReducer";
import Register from "./pages/Register";
import Login from "./pages/Login";
import SellerWrapper from "./components/SellerWrapper";



function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(get_category());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/:sellerName/*" element={<SellerWrapper />} />
        <Route path="/not-found" element={<div>Seller not found</div>} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
