const { Schema, model } = require("mongoose");
const contentSchema = new Schema({
  sellerId: { type: String, required: true },
  tab: { type: String, required: true },
  content: { type: String, required: true },
});
contentSchema.index({ sellerId: 1, tab: 1 }, { unique: true });
module.exports = model("linksContent", contentSchema);
