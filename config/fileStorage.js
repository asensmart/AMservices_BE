const multer = require("multer");

const Brands = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/brands");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = file.mimetype.split("/")[1];
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + extension);
  },
});

const Category = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/categories");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = file.mimetype.split("/")[1];
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + extension);
  },
});

module.exports = {
  BrandStorage: multer({ storage: Brands }).fields([
    { name: "logo", maxCount: 1 },
    { name: "titleBackground", maxCount: 1 },
    { name: "sideImage", maxCount: 1 },
  ]),
  CategoryStorage: multer({ storage: Category }).fields([
    { name: "logo", maxCount: 1 },
    { name: "titleBackground", maxCount: 1 },
    { name: "sideImage", maxCount: 1 },
  ]),
};
