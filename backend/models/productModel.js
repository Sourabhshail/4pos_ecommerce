const { Schema, model } = require('mongoose');

const addonOptionSchema = new Schema({
    text: { type: String, required: true },
    price: { type: Number, required: true }
});

const addonSchema = new Schema({
    question: { type: String, required: false },
    type: { type: String, required: false },
    options: [addonOptionSchema]
});

const bulkPricingSchema = new Schema({
    quantity: { type: Number, required: false },
    price: { type: Number, required: false }
});

const productSchema = new Schema(
  {
    sellerId: {
      type: Schema.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    stock: {
      type: Number,
      required: false,
      default: 0,
    },
    discount: {
      type: Number,
      required: false,
      default: 0,
    },
    description: {
      type: String,
      required: false,
    },
    shopName: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
      required: true,
    },
    addons: [addonSchema],
    bulkPricing: [bulkPricingSchema],
    rating: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

productSchema.index({
    name: 'text',
    category: 'text',
    brand: 'text',
    description: 'text'
}, {
    weights: {
        name: 5,
        category: 4,
        brand: 3,
        description: 2
    }
});

module.exports = model('products', productSchema);