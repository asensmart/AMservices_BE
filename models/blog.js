const mongoose = require("mongoose");

const blogSchema = mongoose.Schema(
  {
    blogTitle: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    banner: {
      type: String,
      required: true,
    },
    moreInfo: {
      type: String,
      default: "",
    },
    metaTitle: {
      type: String,
      required: true,
    },
    metaDescription: {
      type: String,
      required: true,
    },
    metaKeywords: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("blogs", blogSchema);
