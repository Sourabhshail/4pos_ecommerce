import React from 'react';

const ProductCard = ({ product, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-[#ffffff] rounded-lg shadow-lg p-6 max-w-lg w-full text-[#000000] overflow-hidden">
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-white bg-red-500 hover:bg-red-600 p-2 rounded-full"
        >
          &times;
        </button>

        {/* Product Name */}
        <h2 className="text-2xl font-bold text-white mb-4 text-center">{product.name}</h2>

        {/* Product Image */}
        <img 
          className="w-full h-56 object-cover rounded mb-4 border border-gray-700" 
          src={product.images[0]} 
          alt={product.name} 
        />

        {/* Product Info */}
        <div className="space-y-2 text-sm">
          <p><strong>Category:</strong> {product.category}</p>
          <p><strong>Brand:</strong> {product.brand}</p>
          <p><strong>Price:</strong> ${product.price}</p>
          <p><strong>Discount:</strong> {product.discount > 0 ? `${product.discount}%` : 'No Discount'}</p>
          <p><strong>Stock:</strong> {product.stock}</p>
        </div>

        {/* Description */}
        <div className="mt-4">
          <p className="font-semibold">Description:</p>
          <p 
            className={`mt-2 ${product.description.length > 200 ? 'max-h-40 overflow-y-auto' : ''} pr-2`} 
            style={{ scrollbarWidth: product.description.length > 200 ? 'thin' : 'none' }}
          >
            {product.description}
          </p>
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="mt-6 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded w-full"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ProductCard;