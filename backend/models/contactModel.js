const { Schema, model } = require("mongoose");

const contactSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  sellerId: {
    type: Schema.Types.ObjectId,
    ref: "sellers",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "read", "replied"],
    default: "pending"
  }
}, { timestamps: true });

module.exports = model("Contact", contactSchema);