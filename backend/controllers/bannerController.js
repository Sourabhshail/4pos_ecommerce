const formidable = require('formidable')
const cloudinary = require('cloudinary').v2
const { responseReturn } = require('../utiles/response')
const bannerModel = require('../models/bannerModel')
const { mongo: { ObjectId } } = require('mongoose')


class bannerController {
  add_banner = async (req, res) => {
    const form = formidable({ multiples: true });
    form.parse(req, async (err, field, files) => {
      const { sellerId } = field;
      const { image } = files;

      cloudinary.config({
        cloud_name: process.env.cloud_name,
        api_key: process.env.api_key,
        api_secret: process.env.api_secret,
        secure: true,
      });

      try {
        const result = await cloudinary.uploader.upload(image.filepath, {
          folder: "banners",
        });
        const banner = await bannerModel.create({
          sellerId,
          banner: result.url,
          link: result.url,
        });
        responseReturn(res, 201, { banner, message: "banner add success" });
      } catch (error) {
        console.log(error);
        responseReturn(res, 500, { message: error.message });
      }
    });
  };

  get_banner = async (req, res) => {
    const { sellerId } = req.params;
    console.log(sellerId);
    try {
      const banner = await bannerModel.find({
        sellerId: sellerId,
      });
      responseReturn(res, 200, { banner });
    } catch (error) {
      console.log(error);
      responseReturn(res, 500, { message: error.message });
    }
  };

  get_banners = async (req, res) => {
    try {
      const banners = await bannerModel.aggregate([
        {
          $sample: {
            size: 10,
          },
        },
      ]);
      responseReturn(res, 200, { banners });
    } catch (error) {
      console.log(error);
      responseReturn(res, 500, { message: error.message });
    }
  };

  delete_banner = async (req, res) => {
    const { bannerId } = req.params;

    // Validate bannerId
    if (!bannerId) {
      return responseReturn(res, 400, { message: "Banner ID is required" });
    }

    try {
      console.log("Request Params:", req.params);

      // Perform the delete operation
      const banner = await bannerModel.deleteOne({ _id: bannerId });

      // Check if a banner was deleted
      if (banner.deletedCount === 0) {
        return responseReturn(res, 404, { message: "Banner not found" });
      }

      responseReturn(res, 200, {
        message: "Banner deleted successfully",
      });
    } catch (error) {
      console.log("Error:", error.message);
      responseReturn(res, 500, { message: "Internal server error" });
    }
  };
}

module.exports = new bannerController()