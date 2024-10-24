import React from 'react';
import { IoTrashOutline } from 'react-icons/io5';

const EditBulkPricingSection = ({ bulkPricing, setBulkPricing, errors }) => {
  const addBulkPricing = () => {
    setBulkPricing([...bulkPricing, { quantity: '', price: '' }]);
  };

  const removeBulkPricing = (index) => {
    const updatedBulkPricing = bulkPricing.filter((_, i) => i !== index);
    console.log("updatedBulkPricing",updatedBulkPricing);
    setBulkPricing(updatedBulkPricing);
  };
  const handleBulkPricingChange = (index, field, value) => {
    const updatedBulkPricing = bulkPricing.map((pricing, i) =>
      i === index
        ? { ...pricing, [field]: value }  // Create a new object for the updated item
        : pricing
    );
    
    setBulkPricing(updatedBulkPricing);
  };
  
  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold mb-2 text-[#000000]">Bulk Discount Pricing</h2>
      {bulkPricing.map((pricing, index) => (
        <div key={index} className="flex items-center mb-2">
          <div className="flex-1 mr-2">
            <input
              type="number"
              placeholder="Quantity"
              value={pricing.quantity}
              onChange={(e) => handleBulkPricingChange(index, "quantity", e.target.value)}
              className="w-full px-3 py-2 bg-[#ffffff] border border-slate-700 rounded-md text-[#000000]"
            />
            {errors[`bulk_pricing_quantity_${index}`] && (
              <span className="text-red-500 text-sm">{errors[`bulk_pricing_quantity_${index}`]}</span>
            )}
          </div>
          <div className="flex-1 mr-2">
            <input
              type="number"
              placeholder="Price per item"
              value={pricing.price}
              onChange={(e) => handleBulkPricingChange(index, "price", e.target.value)}
              className="w-full px-3 py-2 bg-[#ffffff] border border-slate-700 rounded-md text-[#000000]"
            />
            {errors[`bulk_pricing_price_${index}`] && (
              <span className="text-red-500 text-sm">{errors[`bulk_pricing_price_${index}`]}</span>
            )}
          </div>
          <button
            type="button"
            onClick={() => removeBulkPricing(index)}
            className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
          >
            <IoTrashOutline />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addBulkPricing}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mt-2"
      >
        Add Bulk Pricing
      </button>
    </div>
  );
};

export default EditBulkPricingSection;