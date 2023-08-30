const putRouter = require('express').Router();
const fs = require('fs');
const brandSchema = require('../models/brandSchema');
const categorySchema = require('../models/categorySchema');
const serviceAreaSchema = require('../models/serviceAreaSchema');
const { BrandStorage, CategoryStorage } = require('../config/fileStorage');
const { getFilePathFromURL, parseFileURL } = require('../helpers/parseFileURL');

putRouter.put('/brand', BrandStorage, async (req, res) => {
    const data = JSON.parse(req.body.data);
    if (req.body?.oldLogoURL) {
        const path = getFilePathFromURL(req.body?.oldLogoURL);
        fs.unlink(path, (err) => { })
        const { logo } = parseFileURL(req, ['logo'])
        data.brandLogo = logo;
    }
    if (req.body?.oldSideThumbnailURL) {
        const path = getFilePathFromURL(req.body?.oldSideThumbnailURL);
        fs.unlink(path, (err) => { })
        const { sideImage } = parseFileURL(req, ['sideImage'])
        data.sideThumbnail = sideImage;
    }
    if (req.body?.oldTitleBackgroundImageURL) {
        const path = getFilePathFromURL(req.body?.oldTitleBackgroundImageURL);
        fs.unlink(path, (err) => { })
        const { titleBackground } = parseFileURL(req, ['titleBackground'])
        data.titleBackgroundImage = titleBackground;
    }

    const response = await brandSchema.updateOne({ _id: data._id }, { $set: data })
    res.json({ data: response });
})

putRouter.put('/category', CategoryStorage, async (req, res) => {
    const data = JSON.parse(req.body.data);
    if (req.body?.oldLogoURL) {
        const path = getFilePathFromURL(req.body?.oldLogoURL);
        fs.unlink(path, (err) => { })
        const { logo } = parseFileURL(req, ['logo'])
        data.categoryLogo = logo;
    }
    if (req.body?.oldSideThumbnailURL) {
        const path = getFilePathFromURL(req.body?.oldSideThumbnailURL);
        fs.unlink(path, (err) => { })
        const { sideImage } = parseFileURL(req, ['sideImage'])
        data.sideThumbnail = sideImage;
    }
    if (req.body?.oldTitleBackgroundImageURL) {
        const path = getFilePathFromURL(req.body?.oldTitleBackgroundImageURL);
        fs.unlink(path, (err) => { })
        const { titleBackground } = parseFileURL(req, ['titleBackground'])
        data.titleBackgroundImage = titleBackground;
    }

    const response = await categorySchema.updateOne({ _id: data._id }, { $set: data })
    res.json({ data: response });
})

putRouter.put('/areaName', BrandStorage, async (req, res) => {
    const data = JSON.parse(req.body.data);
    if (req.body?.oldLogoURL) {
        const path = getFilePathFromURL(req.body?.oldLogoURL);
        fs.unlink(path, (err) => { })
        const { logo } = parseFileURL(req, ['logo'])
        data.serviceAreaLogo = logo;
    }
    if (req.body?.oldSideThumbnailURL) {
        const path = getFilePathFromURL(req.body?.oldSideThumbnailURL);
        fs.unlink(path, (err) => { })
        const { sideImage } = parseFileURL(req, ['sideImage'])
        data.sideThumbnail = sideImage;
    }
    if (req.body?.oldTitleBackgroundImageURL) {
        const path = getFilePathFromURL(req.body?.oldTitleBackgroundImageURL);
        fs.unlink(path, (err) => { })
        const { titleBackground } = parseFileURL(req, ['titleBackground'])
        data.titleBackgroundImage = titleBackground;
    }

    const response = await serviceAreaSchema.updateOne({ _id: data._id }, { $set: data })
    res.json({ data: response });
})

module.exports = putRouter;