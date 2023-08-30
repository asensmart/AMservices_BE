const mongoose = require("mongoose");

const ratingSchema = mongoose.Schema(
  {
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
    },
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "brands",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ratings", ratingSchema);
