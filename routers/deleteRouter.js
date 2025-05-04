const deleteRouter = require("express").Router();
const { getFilePathFromURL } = require("../helpers/parseFileURL");
const brandSchema = require("../models/brandSchema");
const categorySchema = require("../models/categorySchema");
const ratingSchema = require("../models/ratingSchema");
const serviceAreaSchema = require("../models/serviceAreaSchema");
const blogSchema = require("../models/blog");
const fs = require("fs");

deleteRouter.delete("/brand", async (req, res) => {
  try {
    const { _id, brandLogo, sideThumbnail, titleBackgroundImage } = req.body;
    const logoPath = getFilePathFromURL(brandLogo);
    const sideThumbnailPath = getFilePathFromURL(sideThumbnail);
    const titleBackgroundImagePath = getFilePathFromURL(titleBackgroundImage);
    await brandSchema.findByIdAndDelete({ _id });
    fs.unlink(logoPath, (err) => {});
    fs.unlink(sideThumbnailPath, (err) => {});
    fs.unlink(titleBackgroundImagePath, (err) => {});
    res.json({ data: "Brand deleted", key: true });
  } catch (error) {
    res.json({ data: "something went wrong!", error, key: false });
  }
});

deleteRouter.delete("/category", async (req, res) => {
  try {
    const { _id, categoryLogo, sideThumbnail, titleBackgroundImage } = req.body;
    const logoPath = getFilePathFromURL(categoryLogo);
    const sideThumbnailPath = getFilePathFromURL(sideThumbnail);
    const titleBackgroundImagePath = getFilePathFromURL(titleBackgroundImage);
    await categorySchema.findByIdAndDelete({ _id });
    fs.unlink(logoPath, (err) => {});
    fs.unlink(sideThumbnailPath, (err) => {});
    fs.unlink(titleBackgroundImagePath, (err) => {});
    res.json({ data: "Category deleted", key: true });
  } catch (error) {
    res.json({ data: "something went wrong!", error, key: false });
  }
});

deleteRouter.delete("/areaName", async (req, res) => {
  try {
    const { _id } = req.body;
    await serviceAreaSchema.findByIdAndDelete({ _id });
    res.json({ data: "Area deleted", key: true });
  } catch (error) {
    res.json({ data: "something went wrong!", error, key: false });
  }
});

deleteRouter.delete("/rating/:ratingId", async (req, res) => {
  try {
    const id = req.params.ratingId;

    const { brandId } = await ratingSchema.findById({ _id: id });

    await ratingSchema
      .deleteOne({ _id: id })
      .then(async (respon) => {
        await ratingSchema.find({ brandId: brandId }).then((dbRes) => {
          console.log("dbRes delete executed");

          const ratingNum = 0;
          let overallRating;
          const totalRatings = dbRes.reduce(
            (sum, rating) => sum + rating.rating,
            ratingNum
          );

          if (dbRes.length !== 0) {
            overallRating = totalRatings / dbRes.length;
          }

          const updateRatingVal =
            dbRes.length === 0 ? (overallRating = 0) : overallRating.toFixed(1);

          brandSchema
            .findOneAndUpdate(
              { _id: brandId },
              { overallRating: updateRatingVal }
            )
            .catch((error) => {
              return res.status(400).json({
                message: "Something went wrong!",
                key: false,
                error,
              });
            });

          return res.json({ data: "Rating deleted", key: true });
        });
      })
      .catch((error) => {
        return res.json({
          data: "something went wrong!",
          error: error,
          key: false,
        });
      });
  } catch (error) {
    res.json({ data: "something went wrong!", error, key: false });
  }
});

deleteRouter.delete("/blog", async (req, res) => {
  try {
    const { _id, banner, thumbnail } = req.body;

    // Get file paths for the images
    const oldBanner = getFilePathFromURL(banner);
    const oldThumbnail = getFilePathFromURL(thumbnail);

    // Delete the blog from the database
    await blogSchema.findByIdAndDelete({ _id });

    // Unlink the images
    fs.unlink(oldBanner, (err) => {
      if (err) console.error(`Error deleting cover image: ${err.message}`);
    });
    fs.unlink(oldThumbnail, (err) => {
      if (err) console.error(`Error deleting thumbnail image: ${err.message}`);
    });

    res.json({ data: "Blog deleted", key: true });
  } catch (error) {
    res.json({ data: "something went wrong!", error, key: false });
  }
});

module.exports = deleteRouter;
