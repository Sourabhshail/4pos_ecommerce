import React, { useState } from "react";
import axios from "axios";

const PayFast = ({ orderId, price }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Replace these with your actual PayFast credentials
  const merchantId = "YOUR_MERCHANT_ID";
  const merchantKey = "YOUR_MERCHANT_KEY";
  const passPhrase = "YOUR_PASSPHRASE"; // Optional, but recommended

  // Replace with your actual URLs
  const returnUrl = "https://localhost:3000/payment-success";
  const cancelUrl = "https://localhost:3000/payment-cancelled";
  const notifyUrl = "https://localhost:3000/api/payfast-notify";

  const generateSignature = (data) => {
    // In a real-world scenario, this should be done server-side for security
    // This is a simplified version for demonstration purposes
    const signatureString = Object.keys(data)
      .filter((key) => key !== "signature")
      .sort()
      .map(
        (key) =>
          `${key}=${encodeURIComponent(data[key])
            .replace(/%20/g, "+")
            .replace(/\s/g, "")}`
      )
      .join("&");

    // In a real implementation, you would use a server-side hashing function
    // This is just a placeholder
    console.log(
      "Signature string:",
      signatureString + "&passphrase=" + encodeURIComponent(passPhrase)
    );
    return "GENERATED_SIGNATURE"; // Replace with actual signature generation
  };

  const handlePayment = async () => {
    setIsLoading(true);
    setError(null);

    const paymentData = {
      merchant_id: merchantId,
      merchant_key: merchantKey,
      amount: price,
      item_name: `Order #${orderId}`,
      return_url: returnUrl,
      cancel_url: cancelUrl,
      notify_url: notifyUrl,
      email_address: "customer@example.com", // You should collect this from the user
      cell_number: "0123456789", // You should collect this from the user
    };

    paymentData.signature = generateSignature(paymentData);

    try {
      // In a production environment, you should make this request from your server
      const response = await axios.post(
        "https://sandbox.payfast.co.za/eng/process",
        paymentData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      // PayFast typically responds with a redirect URL
      if (response.data && response.data.redirect_url) {
        window.location.href = response.data.redirect_url;
      } else {
        throw new Error("Invalid response from PayFast");
      }
    } catch (err) {
      console.error("PayFast payment error:", err);
      setError("There was an error processing your payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full px-4 py-8 bg-white shadow-sm">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button
        onClick={handlePayment}
        disabled={isLoading}
        className="px-10 py-[6px] rounded-sm hover:shadow-orange-500/20 hover:shadow-lg bg-orange-500 text-white disabled:bg-gray-400"
      >
        {isLoading ? "Processing..." : "Pay with PayFast"}
      </button>
    </div>
  );
};

export default PayFast;
