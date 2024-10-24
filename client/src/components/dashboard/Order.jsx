import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { get_order } from "../../store/reducers/orderReducer";

const Order = ({sellerId}) => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const { myOrder } = useSelector((state) => state.order);
  const { userInfo } = useSelector((state) => state.auth);
  const [currencySymbol, setCurrencySymbol] = useState("");

  useEffect(() => {
    dispatch(get_order(orderId));
  }, [orderId, dispatch]);

  useEffect(() => {
    if (myOrder && myOrder.products && myOrder.products.length > 0) {
      setCurrencySymbol(myOrder.products[0].currency || "");
    }
  }, [myOrder]);

  if (!myOrder || Object.keys(myOrder).length === 0) {
    return <div className="bg-white p-5">Loading order details...</div>;
  }

  const calculateDiscountedPrice = (product) => {
    if (!product) return 0;

    const { price = 0, discount = 0, bulkPricing = [] } = product;
    const quantity = product.quantity || 1;

    if (bulkPricing.length > 0) {
      const sortedBulkPricing = [...bulkPricing].sort(
        (a, b) => (b.quantity || 0) - (a.quantity || 0)
      );
      const applicableBulkPrice = sortedBulkPricing.find(
        (bp) => quantity >= (bp.quantity || 0)
      );
      if (applicableBulkPrice) {
        return applicableBulkPrice.price || 0;
      }
    }

    return price - Math.floor((price * discount) / 100);
  };

  const CartItem = ({ product }) => {
    if (!product) return null;

    const discountedPrice = calculateDiscountedPrice(product);
    const originalPrice = product.price || 0;
    const totalDiscount =
      originalPrice > 0
        ? (((originalPrice - discountedPrice) / originalPrice) * 100).toFixed(2)
        : 0;

    return (
      <div className="w-full flex flex-wrap mb-4 p-4 bg-white rounded-lg shadow-sm">
        <div className="flex sm:w-full gap-2 w-7/12">
          <div className="flex gap-2 justify-start items-center">
            <img
              className="w-[80px] h-[80px] object-cover rounded"
              src={
                product.images && product.images.length > 0
                  ? product.images[0]
                  : ""
              }
              alt={product.name || "Product image"}
            />
            <div className="pr-4 text-slate-600">
              <h2 className="text-md font-semibold">
                {product.name || "Unnamed Product"}
              </h2>
              <span className="text-sm">
                Brand: {product.brand || "Unknown"}
              </span>
              {product.addons && product.addons.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700">Addons:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {product.addons.map((addon, index) => (
                      <span
                        key={index}
                        className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-1"
                      >
                        {addon.text || ""} ({currencySymbol}
                        {(addon.price || 0).toFixed(2)})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end w-5/12 sm:w-full sm:mt-3">
          <div className="pl-4 sm:pl-0 text-right">
            <h2 className="text-lg font-bold text-green-600">
              {currencySymbol}
              {discountedPrice.toFixed(2)}
            </h2>
            <p className="text-sm text-gray-500 line-through">
              {currencySymbol}
              {originalPrice.toFixed(2)}
            </p>
            <p className="text-sm text-red-500">-{totalDiscount}%</p>
            <p className="text-sm text-gray-600">
              Quantity: {product.quantity || 1}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-5">
      <h2 className="text-slate-600 font-semibold">
        #{myOrder._id || "N/A"} ,{" "}
        <span className="pl-1">{myOrder.date || "N/A"}</span>
      </h2>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-slate-600 font-semibold">
            Deliver to: {myOrder.shippingInfo?.name || "N/A"}
          </h2>
          <p>
            <span className="bg-blue-200 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
              Home
            </span>
            <span className="text-slate-600 text-sm">
              {myOrder.shippingInfo?.address || ""}{" "}
              {myOrder.shippingInfo?.province || ""}{" "}
              {myOrder.shippingInfo?.city || ""}{" "}
              {myOrder.shippingInfo?.area || ""}
            </span>
          </p>
          <p className="text-slate-600 text-sm font-semibold">
            Email to {userInfo?.email || "N/A"}
          </p>
        </div>
        <div className="text-slate-600">
          <h2>
            Price: {currencySymbol}
            {myOrder.price || 0} including shipping
          </h2>
          <p>
            Payment status:{" "}
            <span
              className={`py-[1px] text-xs px-3 ${
                myOrder.payment_status === "paid"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              } rounded-md`}
            >
              {myOrder.payment_status || "N/A"}
            </span>
          </p>
          <p>
            Order status:{" "}
            <span
              className={`py-[1px] text-xs px-3 ${
                myOrder.delivery_status === "paid"
                  ? "bg-indigo-100 text-indigo-800"
                  : "bg-red-100 text-red-800"
              } rounded-md`}
            >
              {myOrder.delivery_status || "N/A"}
            </span>
          </p>
        </div>
      </div>
      <div className="mt-3">
        <h2 className="text-slate-600 text-lg pb-2">Products</h2>
        <div className="flex gap-5 flex-col">
          {myOrder.products &&
            myOrder.products.map((product, index) => (
              <CartItem key={index} product={product} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Order;
