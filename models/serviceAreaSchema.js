const mongoose = require("mongoose");

const serviceAreaSchema = mongoose.Schema(
  {
    serviceAreaName: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    serviceAreaLogo: {
      type: String,
      required: true,
    },
    sideThumbnail: {
      type: String,
      required: true,
    },
    // description: {
    //   type: String,
    //   required: true,
    // },
    titleBackgroundImage: {
      type: String,
      required: true,
    },
    moreInfo: {
      type: String,
      default: "",
    },
    brandName: {
      type: String,
      required: true,
    },
    categoryName: {
      type: String,
      required: true,
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
    logoAltName: {
      type: String,
      required: true,
    },
    sideImageAltName: {
      type: String,
      required: true,
    },
    titleImageAltName: {
      type: String,
      required: true,
    },
    sideImageHeader: {
      type: String,
      required: true,
    },
    enableFaq: {
      type: Boolean,
      required: true,
    },
    faqs: {
      type: Array,
      default: [],
    },
    // richTextHeader: {
    //   type: String,
    //   required: true,
    // },
    contactNumber: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: "black",
    },
    gMap: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("serviceArea", serviceAreaSchema);
