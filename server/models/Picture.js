const mongoose = require("mongoose");

const Picture = new mongoose.Schema(
  {
    name: { type: String },
    size: { type: String },
    type: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pictures", Picture);
