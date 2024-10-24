import React from 'react';

const PrintableOrderDetails = ({ order }) => {
  if (!order) return null;

  return (
    <>
        <title>Order Details - #{order._id}</title>
      <div className="max-w-4xl mx-auto p-8 bg-white text-black">
        <div className="mb-8 border-b pb-4">
          <h1 className="text-3xl font-bold">Order Details</h1>
          <p className="text-lg">
            Order #{order._id} - {order.date}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-xl font-semibold mb-2">Shipping Information</h2>
            <p>{order.shippingInfo}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
            <p>Payment Status: {order.payment_status}</p>
            <p>Total Price: {order.price}</p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Ordered Products</h2>
          {order.products?.map((product, index) => (
            <div key={index} className="mb-4 pb-4 border-b">
              <div className="flex items-start">
                <img src={product.images[0]} alt={product.name} className="w-20 h-20 object-cover mr-4" />
                <div>
                  <h3 className="text-lg font-medium">{product.name}</h3>
                  <p>Brand: {product.brand}</p>
                  <p>Quantity: {product.quantity}</p>
                  {product.addons && product.addons.length > 0 && (
                    <div className="mt-2">
                      <p className="font-medium">Addons:</p>
                      <ul className="list-disc list-inside">
                        {product.addons.map((addon, addonIndex) => (
                          <li key={addonIndex}>{addon.text}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* <div className="mt-8 text-sm text-gray-500">
          <p>This is a computer-generated document. No signature is required.</p>
        </div> */}
      </div>
    </>
  );
};

export default PrintableOrderDetails;