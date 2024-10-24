import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PayPal = ({ orderId, price }) => {
  return (
    <PayPalScriptProvider options={{ "client-id": "your_paypal_client_id" }}>
      <div className="w-full px-4 py-8 bg-white shadow-sm">
        <PayPalButtons
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: price,
                  },
                  description: `Order ${orderId}`,
                },
              ],
            });
          }}
          onApprove={(data, actions) => {
            return actions.order.capture().then((details) => {
              console.log(
                "Transaction completed by " + details.payer.name.given_name
              );
              // Call your server to save the transaction
            });
          }}
        />
      </div>
    </PayPalScriptProvider>
  );
};

export default PayPal;
