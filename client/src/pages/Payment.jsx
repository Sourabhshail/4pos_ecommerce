import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Headers from "../components/Headers";
import Footer from "../components/Footer";
import Stripe from "../components/Stripe";
import PayFast from "../components/PayFast";
import PayPal from "../components/PayPal";

const Payment = () => {
  // Get sellerId from URL params instead of props
  const { sellerId } = useParams();
  const {
    state: { price, items, orderId, currencySymbol },
  } = useLocation();
  
  const [paymentMethod, setPaymentMethod] = useState("stripe");

  console.log("sellerId from params:", sellerId);

  const renderPaymentMethod = () => {
    switch (paymentMethod) {
      case "stripe":
        return <Stripe orderId={orderId} price={price} />;
      case "payfast":
        return <PayFast orderId={orderId} price={price} />;
      case "paypal":
        return <PayPal orderId={orderId} price={price} />;
      case "eft_cash":
        return (
          <div>
            <div className="w-full px-4 py-8 bg-white shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                EFT/Cash Collection Details
              </h3>
              <p className="mb-2">
                <strong>Account Name:</strong> 4POS (Cannonbury Consultants)
              </p>
              <p className="mb-2">
                <strong>Bank Name:</strong> Absa Bank
              </p>
              <p className="mb-2">
                <strong>Branch :</strong> 630-188
              </p>
              <p className="mb-2">
                <strong>Account Number:</strong> 406-635-4776
              </p>
              <p className="mb-4">
                <strong>Reference:</strong> Order ID: {orderId}
              </p>
            </div>
            <div className="w-full px-4 py-8 bg-white shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                EFT/Cash Collection Details
              </h3>
              <p className="mb-2">
                <strong>Account Name:</strong> 4POS (Cannonbury Consultants)
              </p>
              <p className="mb-2">
                <strong>Bank Name:</strong> Absa Bank
              </p>
              <p className="mb-2">
                <strong>Branch :</strong> 251-141
              </p>
              <p className="mb-2">
                <strong>Account Number:</strong> 6226-4420-333
              </p>
              <p className="mb-4">
                <strong>Reference:</strong> Order ID: {orderId}
              </p>
              <p className="text-sm text-gray-600">
                Please use your Order ID as the payment reference. Your order
                will be shipped once the funds have cleared in our account.
              </p>
              <p className="text-sm text-gray-600">
                Please email us Proof of payment to support@4pos.co.za
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <Headers sellerId={sellerId} />
      <section className="bg-[#eeeeee]">
        <div className="w-[85%] lg:w-[90%] md:w-[90%] sm:w-[90%] mx-auto py-16 mt-4">
          <div className="flex flex-wrap md:flex-col-reverse">
            <div className="w-7/12 md:w-full">
              <div className="pr-2 md:pr-0">
                <div className="flex flex-wrap">
                  <PaymentOption
                    name="stripe"
                    image="stripe.png"
                    active={paymentMethod === "stripe"}
                    onClick={() => setPaymentMethod("stripe")}
                    sellerId={sellerId}
                  />
                  <PaymentOption
                    name="payfast"
                    image="payfast.png"
                    active={paymentMethod === "payfast"}
                    onClick={() => setPaymentMethod("payfast")}
                    sellerId={sellerId}
                  />
                  <PaymentOption
                    name="paypal"
                    image="paypal.png"
                    active={paymentMethod === "paypal"}
                    onClick={() => setPaymentMethod("paypal")}
                    sellerId={sellerId}
                  />
                  <PaymentOption
                    name="EFT/Cash"
                    image="cash.png"
                    active={paymentMethod === "eft_cash"}
                    onClick={() => setPaymentMethod("eft_cash")}
                    sellerId={sellerId}
                  />
                </div>
                {renderPaymentMethod()}
              </div>
            </div>
            <div className="w-5/12 md:w-full">
              <div className="pl-2 md:pl-0 md:mb-0">
                <div className="bg-white shadow p-5 text-slate-600 flex flex-col gap-3">
                  <h2>Order Summary</h2>
                  <div className="flex justify-between items-center">
                    <span>{items} items and shipping fee included</span>
                    <span>
                      {currencySymbol}
                      {price}
                    </span>
                  </div>
                  <div className="flex justify-between items-center font-semibold">
                    <span>Total Amount</span>
                    <span className="text-lg text-orange-500">
                      {currencySymbol}
                      {price}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer sellerId={sellerId} />
    </div>
  );
};

const PaymentOption = ({ name, image, active, onClick, sellerId }) => (
  <div
    onClick={onClick}
    className={`w-[20%] border-r cursor-pointer py-8 px-12 ${
      active ? "bg-white" : "bg-slate-100"
    }`}
  >
    <div className="flex flex-col gap-[3px] justify-center items-center">
      <img
        src={`http://142.93.71.196:3000/images/payment/${image}?id=${sellerId}`}
        alt={name}
      />
      <span className="text-slate-600">{name}</span>
    </div>
  </div>
);

export default Payment;
