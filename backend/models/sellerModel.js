const { Schema, model } = require("mongoose");

const supportSchema = new Schema({
  mobileNo: {
    type: String,
  },
  email: {
    type: String,
  },
  logo: {
    type: String,
  },
  address:{
    type:String
  }
});

const sellerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      default: "seller",
    },
    status: {
      type: String,
      default: "pending",
    },
    payment: {
      type: String,
      default: "inactive",
    },
    method: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    shopInfo: {
      type: Object,
      default: {},
    },
    country: {
      type: Schema.Types.ObjectId,
      ref: "Country",
      required: true,
    },
    currency: {
      type: Schema.Types.ObjectId,
      ref: "Currency",
      required: true,
    },
    support: supportSchema, 
    shippingFee:{
        default:0,
        type:Number
    }
  },
  { timestamps: true }
);

sellerSchema.index(
  {
    name: "text",
    email: "text",
  },
  {
    weights: {
      name: 5,
      email: 4,
    },
  }
);

module.exports = model("sellers", sellerSchema);
