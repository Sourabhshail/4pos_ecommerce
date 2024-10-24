import React, { useEffect } from "react";

const BulkPricingComponent = ({
  product,
  quantity,
  setQuantity,
  updateCurrentPrice,
}) => {
  const getDiscountPercentage = (originalPrice, discountedPrice) => {
    if (!originalPrice || !discountedPrice) return 0;
    return Math.round(
      ((originalPrice - discountedPrice) / originalPrice) * 100
    );
  };

  const getCurrentPrice = () => {
    if (
      !product ||
      !product.bulkPricing ||
      !Array.isArray(product.bulkPricing)
    ) {
      return product?.price || 0;
    }

    const validBulkPricing = product.bulkPricing.filter(
      (item) => item.quantity !== null && item.price !== null
    );

    for (let i = validBulkPricing.length - 1; i >= 0; i--) {
      if (quantity >= validBulkPricing[i].quantity) {
        return validBulkPricing[i].price;
      }
    }
    return product.price;
  };

  const currentPrice = getCurrentPrice();

  // Move useEffect outside of any conditional statements
  useEffect(() => {
    updateCurrentPrice(currentPrice);
  }, [currentPrice, updateCurrentPrice]);

  // If there's no product, return null after the useEffect
  if (!product) {
    return null;
  }

  // Check if there's any valid bulk pricing data
  const hasValidBulkPricing =
    product.bulkPricing &&
    Array.isArray(product.bulkPricing) &&
    product.bulkPricing.some(
      (item) => item.quantity !== null && item.price !== null
    );

  // If there's no valid bulk pricing, don't render the component
  if (!hasValidBulkPricing) {
    return null;
  }

  return (
    <div className="mt-6 border rounded-lg shadow-sm">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-semibold leading-6 text-gray-900">
          Buy More, Save More!
        </h3>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="space-y-4">
        
          {currentPrice && currentPrice < product.price && (
            <div className="text-sm text-green-600 font-medium">
              You're saving {getDiscountPercentage(product.price, currentPrice)}
              % per item!
            </div>
          )}
          <div className="border-t pt-4">
            <h4 className="text-md font-semibold text-gray-700 mb-2">
              Bulk Pricing Options:
            </h4>
            <ul className="space-y-2">
              {product.bulkPricing.map((priceBreak, index) => {
                if (priceBreak.quantity === null || priceBreak.price === null)
                  return null;
                return (
                  <li key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Buy {priceBreak.quantity}+ items:
                    </span>
                    <span className="text-sm font-medium text-blue-600">
                      {product.currency}
                      {priceBreak.price.toFixed(2)} each
                      <span className="text-green-600 ml-2">
                        (Save{" "}
                        {getDiscountPercentage(product.price, priceBreak.price)}
                        %)
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkPricingComponent;
