const getRouter = require("express").Router();
const brandSchema = require("../models/brandSchema");
const blogSchema = require("../models/blog");
const categorySchema = require("../models/categorySchema");
const ratingSchema = require("../models/ratingSchema");
const serviceAreaSchema = require("../models/serviceAreaSchema");

getRouter.get("/brands", async (req, res) => {
  try {
    const response = await brandSchema.find();
    res.json({ data: response, key: true });
  } catch (error) {
    res.json({ data: [], message: "Something went wrong!", key: false });
  }
});

getRouter.get("/brand", async (req, res) => {
  let slug = req.query.slug;
  try {
    const response = await brandSchema
      .findOne({ slug })
      .select(
        "_id brandLogo brandName color contactNumber description faqs logoAltName metaDescription metaKeywords metaTitle moreInfo overallRating richTextHeader sideImageAltName sideImageHeader sideThumbnail titleBackgroundImage titleImageAltName"
      )
      .lean();

    const ratingCount = await ratingSchema
      .find({ brandId: response?._id })
      .count();

    response.ratingCount = ratingCount;

    res.json({ data: response, key: true });
  } catch (error) {
    res.json({ data: [], message: "Something went wrong!", key: false });
  }
});

getRouter.get("/brandByName", async (req, res) => {
  let brandName = req.query.brand;
  try {
    const response = await brandSchema
      .findOne({
        brandName: brandName,
      })
      .select("_id")
      .lean();
    res.json({ data: response, key: true });
  } catch (error) {
    res.json({ data: [], message: "Something went wrong!", key: false });
  }
});

getRouter.get("/categories", async (req, res) => {
  try {
    const response = await categorySchema.find();
    res.json({ data: response, key: true });
  } catch (error) {
    res.json({ data: [], message: "Something went wrong!", key: false });
  }
});

getRouter.get("/category", async (req, res) => {
  let slug = req.query.slug;
  try {
    const response = await categorySchema
      .findOne({ slug })
      .select(
        "_id brandName categoryLogo categoryName color contactNumber description faqs logoAltName metaDescription metaKeywords metaTitle moreInfo richTextHeader sideImageAltName sideImageHeader sideThumbnail titleBackgroundImage titleImageAltName"
      )
      .lean();
    res.json({ data: response, key: true });
  } catch (error) {
    res.json({ data: [], message: "Something went wrong!", key: false });
  }
});

getRouter.get("/categoriesByBrand", async (req, res) => {
  let brandName = req.query.brandName;
  try {
    const response = await categorySchema
      .find({ brandName })
      .select("slug categoryName")
      .lean();
    res.json({ data: response, key: true });
  } catch (error) {
    res.json({ data: [], message: "Something went wrong!", key: false });
  }
});

getRouter.get("/areaNames", async (req, res) => {
  try {
    const response = await serviceAreaSchema.find();
    res.json({ data: response, key: true });
  } catch (error) {
    res.json({ data: [], message: "Something went wrong!", key: false });
  }
});

getRouter.get("/areaName", async (req, res) => {
  try {
    const response = await serviceAreaSchema
      .find({
        brandName: req.query.brandName,
        categoryName: req.query.categoryName,
        slug: req.query.slug,
      })
      .select(
        "_id brandName categoryName slug color contactNumber description faqs logoAltName metaDescription metaKeywords metaTitle moreInfo serviceAreaLogo sideImageAltName sideImageHeader sideThumbnail titleBackgroundImage titleImageAltName"
      )
      .lean();
    res.json({ data: response, key: true });
  } catch (error) {
    res.json({ data: [], message: "Something went wrong!", key: false });
  }
});

getRouter.get("/areaNamesByBrandName", async (req, res) => {
  try {
    const response = await serviceAreaSchema
      .find({
        brandName: req.query.brandName,
      })
      .select("_id brandName categoryName slug title serviceAreaName color")
      .lean();
    res.json({ data: response, key: true });
  } catch (error) {
    res.json({ data: [], message: "Something went wrong!", key: false });
  }
});

getRouter.get("/areaNamesByBrandCategory", async (req, res) => {
  try {
    const response = await serviceAreaSchema.find({
      brandName: req.query.brandName,
      categoryName: req.query.categoryName,
    });
    res.json({ data: response, key: true });
  } catch (error) {
    res.json({ data: [], message: "Something went wrong!", key: false });
  }
});

getRouter.get("/areaNamesByCategoryName", async (req, res) => {
  try {
    const response = await serviceAreaSchema
      .find({
        // categoryName: req.query.categoryName,
        brandName: req.query.categoryName,
      })
      .select("_id brandName categoryName slug title color serviceAreaName")
      .lean();
    res.json({ data: response, key: true });
  } catch (error) {
    res.json({ data: [], message: "Something went wrong!", key: false });
  }
});

getRouter.get("/ratings/:brandId", async (req, res) => {
  try {
    const id = req.params.brandId;

    await ratingSchema
      .find({ brandId: id })
      .populate("brandId")
      .then((dbRes) => {
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
          .findOneAndUpdate({ _id: id }, { overallRating: updateRatingVal })
          .then(async () => {
            const ratingData = await ratingSchema
              .find({ brandId: id })
              .select("_id rating comment createdAt")
              .lean();
            return res
              .status(200)
              .json({ data: ratingData.reverse(), key: true });
            // return res.status(200).json({ data: dbRes.reverse(), key: true });
          })
          .catch((error) => {
            return res.status(400).json({
              message: "Something went wrong!",
              key: false,
              error: error,
            });
          });
      })
      .catch((error) => {
        res.json({ message: "Something went wrong!", key: false, error });
      });
  } catch (error) {
    res.json({ data: [], message: "Something went wrong!", key: false });
  }
});

getRouter.get("/overallRating", async (req, res) => {
  try {
    const id = req.params.brandId;

    ratingSchema
      .aggregate([
        {
          $group: {
            _id: null,
            ratingCount: {
              $sum: 1,
            },
            avgRating: {
              $avg: "$rating",
            },
          },
        },
      ])
      .then((dbRes) => {
        return res.status(200).json({
          data: {
            avgRating: dbRes[0].avgRating.toFixed(1),
            ratingCount: dbRes[0].ratingCount,
          },
          key: true,
        });
      })
      .catch((error) => {
        res.json({ message: "Something went wrong!", key: false, error });
      });
  } catch (error) {
    res.json({ data: [], message: "Something went wrong!", key: false });
  }
});

getRouter.get("/ratingsCount", async (req, res) => {
  try {
    ratingSchema
      .find()
      .count()
      .then((dbRes) => {
        return res.status(200).json({
          data: dbRes,
          key: true,
        });
      });
  } catch (error) {
    res.json({ data: [], message: "Something went wrong!", key: false });
  }
});

getRouter.get("/sitemapData", async (req, res) => {
  var BASE_URL = "https://customercareinchennai.com";
  var sitemapData = [];

  // find brand data
  const findBrand = await brandSchema.find().populate("brandName");
  const brandData = findBrand.map((brand) => ({
    url: `${BASE_URL}/${brand?.brandName}`,
    lastModified: new Date(),
    priority: 1,
  }));

  // find category data
  const findCat = await categorySchema
    .find()
    .populate("brandName categoryName");
  const catData = findCat.map((cat) => ({
    url: `${BASE_URL}/${cat?.brandName}/${cat?.categoryName}`,
    lastModified: new Date(),
    priority: 1,
  }));

  const findArea = await serviceAreaSchema
    .find()
    .populate("brandName categoryName slug");
  const areaData = findArea.map((cat) => ({
    url: `${BASE_URL}/${cat?.brandName}/${cat?.categoryName}${cat?.slug}`,
    lastModified: new Date(),
    priority: 1,
  }));

  sitemapData = [...brandData, ...catData, ...areaData];
  res.send(sitemapData);
  // res.json({ key: true, data: response });
});

getRouter.get("/getAllBlogs", async (req, res) => {
  try {
    await blogSchema
      .find()
      .then((dbRes) => {
        res
          .status(200)
          .json({ message: "Blogs fetched", key: true, data: dbRes });
      })
      .catch((error) => {
        res.status(500).json({
          message: "Something went wrong! Please Try Again Later",
          key: false,
          error,
        });
      });
  } catch (error) {
    res.status(500).json({ message: "Error fetching blogs", error });
  }
});

getRouter.get("/getBlog/:id", async (req, res) => {
  try {
    const id = req.params.id;

    await blogSchema
      .find({ _id: id })
      .then((dbRes) => {
        res
          .status(200)
          .json({ message: "Blog fetched", key: true, data: dbRes[0] });
      })
      .catch((error) => {
        res.status(500).json({
          message: "Something went wrong! Please Try Again Later",
          key: false,
          error,
        });
      });
  } catch (error) {
    res.status(500).json({ message: "Error fetching blogs", error });
  }
});

// this api for lg.net website
getRouter.get("/lgratings/:brandName", async (req, res) => {
  try {
    // const brandName = req.params.brandName
    const findIdByBrandName = await brandSchema.findOne({
      brandName: req.params.brandName,
    });

    ratingSchema.find({ brandId: findIdByBrandName._id }).then((dbRes) => {
      // return res.status(200).json(dbRes.length)
      return res.status(200).json(dbRes.reverse());
    });
  } catch (error) {
    res.json({ data: [], message: "Something went wrong!", key: false });
  }
});

getRouter.get("/slicedRatings/:id", async (req, res) => {
  try {
    const findIdByBrandName = await brandSchema.findOne({
      brandName: req.params.id,
    });

    // console.log('findIdByBrandName -->', findIdByBrandName)

    ratingSchema
      .find({ brandId: findIdByBrandName._id })
      .sort({ createdAt: -1 })
      .limit(3)
      .then((dbRes) => {
        console.log("dbRes -->", dbRes);
        // const findByBrandName = dbRes.find({ brandName: 'lg' })
        return res.status(200).json(dbRes.reverse());
      });
  } catch (error) {
    res.json({ data: [], message: "Something went wrong!", key: false });
  }
});

getRouter.get("/lgRatingCount/:brandName", async (req, res) => {
  try {
    const findIdByBrandName = await brandSchema.findOne({
      brandName: req.params.brandName,
    });

    const ratingCount = await ratingSchema
      .find({ brandId: findIdByBrandName._id })
      .count();

    return res.status(200).json({
      overallRating: findIdByBrandName.overallRating,
      ratingCount: ratingCount,
    });
  } catch (error) {
    res.json({ data: [], message: "Something went wrong!", key: false });
  }
});

module.exports = getRouter;
