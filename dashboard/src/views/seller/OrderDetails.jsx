import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  messageClear,
  get_seller_order,
  seller_order_status_update,
} from "../../store/Reducers/OrderReducer";
import PrintableOrderDetails from "../components/PrintableOrderDetails";
import { Helmet } from "react-helmet";


const OrderDetails = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();

  const { order, errorMessage, successMessage } = useSelector(
    (state) => state.order
  );
  const handlePrint = () => {
    window.print();
  };
  useEffect(() => {
    dispatch(get_seller_order(orderId));
  }, [orderId]);

  const [status, setStatus] = useState("");
  useEffect(() => {
    setStatus(order?.delivery_status);
  }, [order]);

  const status_update = (e) => {
    dispatch(
      seller_order_status_update({ orderId, info: { status: e.target.value } })
    );
    setStatus(e.target.value);
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage]);

  return (
    <>
      <title>Order Details - #{order?._id}</title>
      <div className="px-2 lg:px-7 pt-5 print:hidden">
        <div className="w-full p-4 bg-[#ffffff] rounded-md">
          <div className="flex justify-between items-center p-4">
            <h2 className="text-xl text-[#000000]">Order Details</h2>
            <div className="flex items-center gap-3">
              <select
                onChange={status_update}
                value={status}
                className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#ffffff] border border-slate-700 rounded-md text-[#000000]"
              >
                <option value="pending">pending</option>
                <option value="processing">processing</option>
                <option value="placed">placed</option>
                <option value="assigned">assigned</option>
                <option value="picked">picked</option>
                <option value="transit">in-transit</option>
                <option value="delivered">delivered</option>
                <option value="cancelled">cancelled</option>
              </select>
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Print Order Details
              </button>
            </div>
          </div>
          <div className="p-4">
            <div className="flex gap-2 text-lg text-[#000000]">
              <h2>#{order._id}</h2>
              <span>{order.date}</span>
            </div>
            <div className="flex flex-wrap">
              <div className="w-[32%]">
                <div className="pr-3 text-[#000000] text-lg">
                  <div className="flex flex-col gap-1">
                    <h2 className="pb-2 font-semibold">
                      Deliver to : {order.shippingInfo}
                    </h2>
                  </div>
                  <div className="flex justify-start items-center gap-3">
                    <h2>Payment Status : </h2>
                    <span className="text-base">{order.payment_status}</span>
                  </div>
                  <span>Price : {order.price}</span>
                  <div className="mt-4 flex flex-col gap-4">
                    <div className="text-[#000000] flex flex-col gap-6">
                      {order?.products?.map((p, i) => (
                        <div key={i} className="flex gap-3 text-md">
                          <img
                            className="w-[45px] h-[45px]"
                            src={p.images[0]}
                            alt={p.name}
                          />
                          <div>
                            <h2>{p.name}</h2>
                            <p>
                              <span>Brand: </span>
                              <span>{p.brand} </span>
                              <span className="text-lg">
                                Quantity: {p.quantity}
                              </span>
                            </p>
                            {p.addons && p.addons.length > 0 && (
                              <div className="mt-2">
                                <p className="text-sm font-medium text-gray-300">
                                  Addons:
                                </p>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {p.addons.map((addon, index) => (
                                    <span
                                      key={index}
                                      className="text-xs bg-blue-100 text-blue-800 px-2 py-1"
                                    >
                                      {addon.text}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden print:block">
        <PrintableOrderDetails order={order} />
      </div>
    </>
  );
};

export default OrderDetails;
