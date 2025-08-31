const postRouter = require("express").Router();
const {
  BrandStorage,
  CategoryStorage,
  BlogStorage,
} = require("../config/fileStorage");
const { parseFileURL } = require("../helpers/parseFileURL");
const brandSchema = require("../models/brandSchema");
const categorySchema = require("../models/categorySchema");
const serviceAreaSchema = require("../models/serviceAreaSchema");
const userSchema = require("../models/userSchema");
const ratingSchema = require("../models/ratingSchema");
const blogSchema = require("../models/blog");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const common = require("../helpers/common");

async function TokenAuthentication(req, res, next) {
  try {
    let token = req.cookies.token;
    let decodedToken = JWT.verify(token, process.env.SECRET_KEY, {
      algorithms: ["HS256"],
    });

    let user = await userSchema.findOne({ email: decodedToken.email });

    if (!user) {
      res.clearCookie("token");
      return res
        .status(401)
        .json({ message: "User authentication failed", success: false });
    }
    next();
  } catch (error) {
    res.clearCookie("token");
    res.status(401).json({ message: error.message, success: false, error });
  }
}

postRouter.post("/validate", TokenAuthentication, (req, res) => {
  res.status(200).json({ message: "Authorized user", success: true });
});

postRouter.post("/createBrand", BrandStorage, async (req, res) => {
  try {
    const { logo, titleBackground, sideImage } = parseFileURL(req, [
      "logo",
      "titleBackground",
      "sideImage",
    ]);
    const {
      brandName,
      slug,
      title,
      // description,
      moreInfo,
      metaTitle,
      metaDescription,
      metaKeywords,
      logoAltName,
      sideImageAltName,
      titleImageAltName,
      sideImageHeader,
      enableFaq,
      faqs,
      // richTextHeader,
      contactNumber,
      color,
    } = JSON.parse(req.body.data);
    await brandSchema({
      brandName,
      slug,
      title,
      // description,
      moreInfo,
      brandLogo: logo,
      titleBackgroundImage: titleBackground,
      sideThumbnail: sideImage,
      metaTitle,
      metaDescription,
      metaKeywords,
      logoAltName,
      sideImageAltName,
      titleImageAltName,
      sideImageHeader,
      enableFaq,
      faqs,
      // richTextHeader,
      contactNumber,
      color,
    }).save();
    res.status(200).json({ message: "Brand created", key: true });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong! Please Try Again Later",
      key: false,
      error,
    });
  }
});

postRouter.post("/createServiceArea", BrandStorage, async (req, res) => {
  try {
    const { logo, titleBackground, sideImage } = parseFileURL(req, [
      "logo",
      "titleBackground",
      "sideImage",
    ]);
    const {
      serviceAreaName,
      slug,
      title,
      // description,
      moreInfo,
      brandName,
      metaTitle,
      metaDescription,
      metaKeywords,
      logoAltName,
      sideImageAltName,
      titleImageAltName,
      sideImageHeader,
      enableFaq,
      faqs,
      // richTextHeader,
      contactNumber,
      color,
      categoryName,
      gMap,
    } = JSON.parse(req.body.data);
    await serviceAreaSchema({
      serviceAreaName,
      slug,
      title,
      // description,
      moreInfo,
      serviceAreaLogo: logo,
      titleBackgroundImage: titleBackground,
      sideThumbnail: sideImage,
      brandName,
      metaTitle,
      metaDescription,
      metaKeywords,
      logoAltName,
      sideImageAltName,
      titleImageAltName,
      sideImageHeader,
      enableFaq,
      faqs,
      // richTextHeader,
      contactNumber,
      color,
      categoryName,
      gMap,
    }).save();
    res.status(200).json({ message: "Service Area created", key: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong! Please Try Again Later",
      key: false,
      error,
    });
  }
});

postRouter.post("/createCategory", CategoryStorage, async (req, res) => {
  try {
    const { logo, titleBackground, sideImage } = parseFileURL(req, [
      "logo",
      "titleBackground",
      "sideImage",
    ]);
    const {
      categoryName,
      slug,
      title,
      // description,
      moreInfo,
      brandName,
      metaTitle,
      metaDescription,
      metaKeywords,
      logoAltName,
      sideImageAltName,
      titleImageAltName,
      sideImageHeader,
      enableFaq,
      faqs,
      // richTextHeader,
      contactNumber,
      color,
    } = JSON.parse(req.body.data);
    await categorySchema({
      categoryName,
      slug,
      title,
      // description,
      moreInfo,
      brandName,
      categoryLogo: logo,
      titleBackgroundImage: titleBackground,
      sideThumbnail: sideImage,
      metaTitle,
      metaDescription,
      metaKeywords,
      logoAltName,
      sideImageAltName,
      titleImageAltName,
      sideImageHeader,
      enableFaq,
      faqs,
      // richTextHeader,
      contactNumber,
      color,
    }).save();
    res.status(200).json({ message: "Category created", key: true });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong! Please Try Again Later",
      key: false,
      error,
    });
  }
});

postRouter.post("/postRating", async (req, res) => {
  const { rating, comment, brandId } = req.body;

  try {
    if (!rating && !brandId) {
      return res.status(500).json({
        message: "Rating must be filled",
        key: false,
      });
    }

    if (rating > 0 && rating <= 5) {
      await ratingSchema
        .create({ rating: rating, comment: comment, brandId: brandId })
        .then(async (response) => {
          await ratingSchema.find({ brandId: brandId }).then((dbRes) => {
            const ratingNum = 0;
            const totalRatings = dbRes.reduce(
              (sum, rating) => sum + rating.rating,
              ratingNum
            );

            const overallRating = totalRatings / dbRes.length;

            brandSchema
              .findOneAndUpdate(
                { _id: brandId },
                { overallRating: overallRating.toFixed(1) }
              )
              .catch((error) => {
                return res.status(400).json({
                  message: "Something went wrong!",
                  key: false,
                  error,
                });
              });

            return res
              .status(200)
              .json({ message: "Rating Posted", key: true, data: response });
          });
        });
    } else {
      return res
        .status(400)
        .json({ message: "Something Went Wrong!", key: false });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong! Please Try Again Later",
      key: false,
      error,
    });
  }
});

postRouter.post("/ratingCountByBrand", async (req, res) => {
  try {
    const reqData = req.body;

    await brandSchema
      .findOne({ brandName: reqData.brandName })
      .then(async (dbRes) => {
        await ratingSchema
          .aggregate([
            {
              $match: {
                brandId: dbRes._id,
              },
            },
            {
              $count: "brandId",
            },
          ])
          .then((ratingData) => {
            return res.status(200).json({
              data: {
                overallRating: dbRes.overallRating,
                ratingCount: ratingData[0].brandId,
              },
              key: true,
            });
          })
          .catch((error) => {
            return res.json({
              message: "Something went wrong!",
              key: false,
              error,
            });
          });
      })
      .catch((error) => {
        return res.json({
          message: "Something went wrong!",
          key: false,
          error,
        });
      });
  } catch (error) {
    res.json({ data: [], message: "Something went wrong!", key: false });
  }
});

postRouter.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    let isUserExist = await userSchema.findOne({ email });

    if (!isUserExist)
      return res
        .status(404)
        .json({ message: "User not found", success: false });

    let isPasswordMatched = await bcrypt.compare(
      password,
      isUserExist.password
    );

    if (!isPasswordMatched)
      return res
        .status(401)
        .json({ message: "Password not matched", success: false });

    let payload = {
      email: isUserExist.email,
    };

    res.cookie(
      "token",
      JWT.sign(payload, process.env.SECRET_KEY, {
        expiresIn: "1h",
      }),
      { httpOnly: true }
    );
    res.status(200).json({
      message: "Successfully loggedIn",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong! Please Try Again Later",
      key: false,
      error,
    });
  }
});

postRouter.post("/resetPassword", async (req, res) => {
  try {
    let { email, password } = req.body;
    let isUserExist = await userSchema.findOne({ email });

    if (!isUserExist)
      return res
        .status(404)
        .json({ message: "User not found", success: false });

    let hashPwd = await bcrypt.hash(password, 10);

    userSchema
      .findOneAndUpdate({ email: email }, { password: hashPwd })
      .then((dbRes) => {
        res.status(200).json({
          message: "Password Reset Successfully",
          actualPassword: password,
          password: hashPwd,
          passwordStatus: dbRes,
          success: true,
        });
      });

    // if (!isPasswordMatched)
    //   return res
    //     .status(401)
    //     .json({ message: "Password not matched", success: false });

    // let payload = {
    //   email: isUserExist.email,
    // };

    // res.cookie(
    //   "token",
    //   JWT.sign(payload, process.env.SECRET_KEY, {
    //     expiresIn: "1h",
    //   }),
    //   { httpOnly: true }
    // );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong! Please Try Again Later",
      key: false,
      error,
    });
  }
});

postRouter.post("/logout", async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out!", key: true });
});

// this api for lg.net website
postRouter.post("/lgRating", async (req, res) => {
  const { rating, comment, brandName } = req.body;

  try {
    // console.log('rating, comment, brandName --->', rating, comment, brandName)

    if (!rating && !brandName) {
      return res.status(500).json({
        message: "Rating must be filled",
        key: false,
      });
    }

    if (rating > 0 && rating <= 5) {
      const findIdByBrandName = await brandSchema.findOne({
        brandName: brandName,
      });

      // console.log('findBrandName --->', findIdByBrandName)

      await ratingSchema
        .create({
          rating: rating,
          comment: comment,
          brandId: findIdByBrandName,
        })
        .then(async (response) => {
          // return res.json(response)
          await ratingSchema
            .find({ brandId: findIdByBrandName })
            .then((dbRes) => {
              const ratingNum = 0;
              const totalRatings = dbRes.reduce(
                (sum, rating) => sum + rating.rating,
                ratingNum
              );

              const overallRating = totalRatings / dbRes.length;

              brandSchema
                .findOneAndUpdate(
                  { _id: findIdByBrandName },
                  { overallRating: overallRating.toFixed(1) }
                )
                .catch((error) => {
                  return res.status(400).json({
                    message: "Something went wrong!",
                    key: false,
                    error,
                  });
                });

              return res
                .status(200)
                .json({ message: "Rating Posted", key: true, data: response });
            });
        });
    } else {
      return res
        .status(400)
        .json({ message: "Something Went Wrong!", key: false });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong! Please Try Again Later",
      key: false,
      error,
    });
  }
});

postRouter.post("/smtp/sendmail", async (req, res) => {
  try {
    const reqBody = req.body;

    var htmlBody = `<div>
      <p>Name: ${reqBody?.name}</p>
      <p>Email: ${reqBody?.email}</p>
      <p>Phone: ${reqBody?.number}</p>
      <p>Message: ${reqBody?.message}</p>
    </div>`;
    common.sendEmail(
      "customercareinchennai@gmail.com",
      `You got a new enquiry from ${reqBody?.name}`,
      htmlBody,
      (callback) => {
        console.log("sent");
        if (callback) {
          return res.status(200).json({
            message: "Mail sent successfully!",
            key: true,
          });
        } else {
          return res.status(421).json({
            message: "The service is unavailable, try again later",
            key: false,
          });
        }
      }
    );
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong! Please Try Again Later",
      key: false,
      error,
    });
  }
});

// Blog Router API

postRouter.post("/createBlog", BlogStorage, async (req, res) => {
  try {
    const { banner, thumbnail } = parseFileURL(req, ["banner", "thumbnail"]);
    const blogData = req.body;

    const {
      blogTitle,
      shortDescription,
      metaKeywords,
      metaTitle,
      moreInfo,
      metaDescription,
    } = JSON.parse(blogData?.data);

    await blogSchema
      .create({
        blogTitle: blogTitle,
        shortDescription: shortDescription,
        thumbnail: thumbnail,
        banner: banner,
        moreInfo: moreInfo,
        metaTitle: metaTitle,
        metaDescription: metaDescription,
        metaKeywords: metaKeywords,
      })
      .then((dbRes) => {
        res.status(201).json({ message: "Blog created", key: true });
      })
      .catch((error) => {
        res.status(500).json({
          message: "Something went wrong! Please Try Again Later",
          key: false,
          error,
        });
      });
  } catch (error) {
    res.status(500).json({ message: "Error creating blog", error });
  }
});

module.exports = postRouter;
