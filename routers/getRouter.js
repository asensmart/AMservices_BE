const getRouter = require('express').Router()
const brandSchema = require('../models/brandSchema')
const categorySchema = require('../models/categorySchema')
const ratingSchema = require('../models/ratingSchema')
const serviceAreaSchema = require('../models/serviceAreaSchema')

getRouter.get('/brands', async (req, res) => {
  try {
    const response = await brandSchema.find()
    res.json({ data: response, key: true })
  } catch (error) {
    res.json({ data: [], message: 'Something went wrong!', key: false })
  }
})

getRouter.get('/brand', async (req, res) => {
  let slug = req.query.slug
  try {
    const response = await brandSchema.findOne({ slug })
    res.json({ data: response, key: true })
  } catch (error) {
    res.json({ data: [], message: 'Something went wrong!', key: false })
  }
})

getRouter.get('/brandByName', async (req, res) => {
  let brandName = req.query.brand
  try {
    const response = await brandSchema.findOne({
      brandName: brandName
    })
    res.json({ data: response, key: true })
  } catch (error) {
    res.json({ data: [], message: 'Something went wrong!', key: false })
  }
})

getRouter.get('/categories', async (req, res) => {
  try {
    const response = await categorySchema.find()
    res.json({ data: response, key: true })
  } catch (error) {
    res.json({ data: [], message: 'Something went wrong!', key: false })
  }
})

getRouter.get('/category', async (req, res) => {
  let slug = req.query.slug
  try {
    const response = await categorySchema.findOne({ slug })
    res.json({ data: response, key: true })
  } catch (error) {
    res.json({ data: [], message: 'Something went wrong!', key: false })
  }
})

getRouter.get('/categoriesByBrand', async (req, res) => {
  let brandName = req.query.brandName
  try {
    const response = await categorySchema.find({ brandName })
    res.json({ data: response, key: true })
  } catch (error) {
    res.json({ data: [], message: 'Something went wrong!', key: false })
  }
})

getRouter.get('/areaNames', async (req, res) => {
  try {
    const response = await serviceAreaSchema.find()
    res.json({ data: response, key: true })
  } catch (error) {
    res.json({ data: [], message: 'Something went wrong!', key: false })
  }
})

getRouter.get('/areaName', async (req, res) => {
  try {
    const response = await serviceAreaSchema.find({ slug: req.query.slug })
    res.json({ data: response, key: true })
  } catch (error) {
    res.json({ data: [], message: 'Something went wrong!', key: false })
  }
})

getRouter.get('/areaNamesByBrandName', async (req, res) => {
  try {
    const response = await serviceAreaSchema.find({
      brandName: req.query.brandName
    })
    res.json({ data: response, key: true })
  } catch (error) {
    res.json({ data: [], message: 'Something went wrong!', key: false })
  }
})

getRouter.get('/areaNamesByBrandCategory', async (req, res) => {
  try {
    const response = await serviceAreaSchema.find({
      brandName: req.query.brandName,
      categoryName: req.query.categoryName
    })
    res.json({ data: response, key: true })
  } catch (error) {
    res.json({ data: [], message: 'Something went wrong!', key: false })
  }
})

getRouter.get('/areaNamesByCategoryName', async (req, res) => {
  try {
    const response = await serviceAreaSchema.find({
      categoryName: req.query.categoryName
    })
    res.json({ data: response, key: true })
  } catch (error) {
    res.json({ data: [], message: 'Something went wrong!', key: false })
  }
})

getRouter.get('/ratings/:brandId', async (req, res) => {
  try {
    const id = req.params.brandId

    await ratingSchema
      .find({ brandId: id })
      .populate('brandId')
      .then(dbRes => {
        const ratingNum = 0
        let overallRating
        const totalRatings = dbRes.reduce(
          (sum, rating) => sum + rating.rating,
          ratingNum
        )

        if (dbRes.length !== 0) {
          overallRating = totalRatings / dbRes.length
        }

        const updateRatingVal =
          dbRes.length === 0 ? (overallRating = 0) : overallRating.toFixed(1)

        brandSchema
          .findOneAndUpdate({ _id: id }, { overallRating: updateRatingVal })
          .then(() => {
            return res.status(200).json({ data: dbRes.reverse(), key: true })
          })
          .catch(error => {
            return res.status(400).json({
              message: 'Something went wrong!',
              key: false,
              error: error
            })
          })
      })
      .catch(error => {
        res.json({ message: 'Something went wrong!', key: false, error })
      })
  } catch (error) {
    res.json({ data: [], message: 'Something went wrong!', key: false })
  }
})

getRouter.get('/overallRating', async (req, res) => {
  try {
    const id = req.params.brandId

    ratingSchema
      .aggregate([
        {
          $group: {
            _id: null,
            ratingCount: {
              $sum: 1
            },
            avgRating: {
              $avg: '$rating'
            }
          }
        }
      ])
      .then(dbRes => {
        return res.status(200).json({
          data: {
            avgRating: dbRes[0].avgRating.toFixed(1),
            ratingCount: dbRes[0].ratingCount
          },
          key: true
        })
      })
      .catch(error => {
        res.json({ message: 'Something went wrong!', key: false, error })
      })
  } catch (error) {
    res.json({ data: [], message: 'Something went wrong!', key: false })
  }
})

getRouter.get('/ratingsCount', async (req, res) => {
  try {
    ratingSchema
      .find()
      .count()
      .then(dbRes => {
        return res.status(200).json({
          data: dbRes,
          key: true
        })
      })
  } catch (error) {
    res.json({ data: [], message: 'Something went wrong!', key: false })
  }
})

// this api for lg.net website
getRouter.get('/lgratings/:brandName', async (req, res) => {
  try {
    // const brandName = req.params.brandName
    const findIdByBrandName = await brandSchema.findOne({
      brandName: req.params.brandName
    })

    ratingSchema.find({ brandId: findIdByBrandName._id }).then(dbRes => {
      // return res.status(200).json(dbRes.length)
      return res.status(200).json(dbRes.reverse())
    })
  } catch (error) {
    res.json({ data: [], message: 'Something went wrong!', key: false })
  }
})

getRouter.get('/slicedRatings/:id', async (req, res) => {
  try {
    const findIdByBrandName = await brandSchema.findOne({
      brandName: req.params.id
    })

    // console.log('findIdByBrandName -->', findIdByBrandName)

    ratingSchema
      .find({ brandId: findIdByBrandName._id })
      .sort({ createdAt: -1 })
      .limit(3)
      .then(dbRes => {
        console.log('dbRes -->', dbRes)
        // const findByBrandName = dbRes.find({ brandName: 'lg' })
        return res.status(200).json(dbRes.reverse())
      })
  } catch (error) {
    res.json({ data: [], message: 'Something went wrong!', key: false })
  }
})

getRouter.get('/lgRatingCount/:brandName', async (req, res) => {
  try {
    const findIdByBrandName = await brandSchema.findOne({
      brandName: req.params.brandName
    })

    const ratingCount = await ratingSchema
      .find({ brandId: findIdByBrandName._id })
      .count()

    return res.status(200).json({
      overallRating: findIdByBrandName.overallRating,
      ratingCount: ratingCount
    })
  } catch (error) {
    res.json({ data: [], message: 'Something went wrong!', key: false })
  }
})

module.exports = getRouter
