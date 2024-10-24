const formidable = require("formidable");
const cloudinary = require("cloudinary").v2;
const productModel = require("../../models/productModel");
const { responseReturn } = require("../../utiles/response");
class productController {
  add_product = async (req, res) => {
    const { id } = req;

    const form = formidable({ multiples: true });

    form.parse(req, async (err, field, files) => {
      if (err) {
        return responseReturn(res, 500, {
          error: "Error parsing the form data",
        });
      }

      let {
        name,
        category,
        description,
        stock,
        price,
        discount,
        shopName,
        brand,
        addons, // Extract addons from the field
        bulkPricing,
        currency
      } = field;

      name = name.trim();
      const slug = name.split(" ").join("-");

      // Initialize Cloudinary
      cloudinary.config({
        cloud_name: process.env.cloud_name,
        api_key: process.env.api_key,
        api_secret: process.env.api_secret,
        secure: true,
      });

      try {
        // Ensure images are in an array
        let images = Array.isArray(files.images)
          ? files.images
          : [files.images];

        // Function to upload images to Cloudinary
        const uploadImagesToCloudinary = async (images) => {
          let allImageUrls = [];
          for (let image of images) {
            const result = await cloudinary.uploader.upload(image.filepath, {
              folder: "products",
            });
            allImageUrls.push(result.url); // Store the URL
          }
          return allImageUrls;
        };

        // Upload all images and get the URLs
        const allImageUrls = await uploadImagesToCloudinary(images);

        // Parse the addons field, if it exists
        let parsedAddons = [];

        if (addons) {
          parsedAddons = JSON.parse(addons); // Ensure it is parsed from a string
        }

        let parsedBulkPricing = [];
        if (bulkPricing) {
          parsedBulkPricing = JSON.parse(bulkPricing);
        }

        // Create product with image URLs and addons
        await productModel.create({
          sellerId: id,
          name,
          slug,
          shopName,
          category: category?.trim() || "",
          description: description?.trim() || "",
          stock: stock ? parseInt(stock) : 0,
          price: price ? parseInt(price) : 0,
          discount: discount ? parseInt(discount) : 0,
          images: allImageUrls, // Store the array of image URLs
          brand: brand?.trim() || "",
          addons: parsedAddons, // Store the parsed addons
          bulkPricing: parsedBulkPricing,
          currency:currency
        });

        // Send success response
        responseReturn(res, 201, { message: "Product added successfully" });
      } catch (error) {
        responseReturn(res, 500, { error: error.message });
      }
    });
  };

  products_get = async (req, res) => {
    const { page, searchValue, parPage } = req.query;
    const { id } = req;

    const skipPage = parseInt(parPage) * (parseInt(page) - 1);

    try {
      if (searchValue) {
        const products = await productModel
          .find({
            $text: { $search: searchValue },
            sellerId: id,
          })
          .skip(skipPage)
          .limit(parPage)
          .sort({ createdAt: -1 });
        const totalProduct = await productModel
          .find({
            $text: { $search: searchValue },
            sellerId: id,
          })
          .countDocuments();
        responseReturn(res, 200, { totalProduct, products });
      } else {
        const products = await productModel
          .find({ sellerId: id })
          .skip(skipPage)
          .limit(parPage)
          .sort({ createdAt: -1 });
        const totalProduct = await productModel
          .find({ sellerId: id })
          .countDocuments();
        responseReturn(res, 200, { totalProduct, products });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  product_get = async (req, res) => {
    const { productId } = req.params;
    try {
      const product = await productModel.findById(productId);
      responseReturn(res, 200, { product });
    } catch (error) {
      console.log(error.message);
    }
  };

  product_delete = async (req, res) => {
    const { productId } = req.params;
    try {
      // Perform the delete operation
      const deletedProduct = await productModel.deleteOne({ _id: productId });
      responseReturn(res, 200, {
        deletedProduct,
        message: "product delete success",
      });
    } catch (error) {
      console.log("error : ", error.message);
    }
  };

  product_update = async (req, res) => {
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return responseReturn(res, 500, {
          error: "Error parsing the form data",
        });
      }

      let {
        name,
        description,
        discount,
        price,
        brand,
        productId,
        stock,
        addons,
        bulkPricing,
        deletedImages,
        currency
      } = fields;
      name = name?.trim() || "";
      const slug = name?.split(" ")?.join("-") || "";

      try {
        // Initialize Cloudinary
        cloudinary.config({
          cloud_name: process.env.cloud_name,
          api_key: process.env.api_key,
          api_secret: process.env.api_secret,
          secure: true,
        });

        // Function to upload images to Cloudinary
        const uploadImagesToCloudinary = async (images) => {
          let allImageUrls = [];
          for (let image of images) {
            const result = await cloudinary.uploader.upload(image.filepath, {
              folder: "products",
            });
            allImageUrls.push(result.url);
          }
          return allImageUrls;
        };

        // Get the existing product
        const existingProduct = await productModel.findById(productId);

        // Handle new images
        let newImageUrls = [];
        if (files.newImages) {
          const newImages = Array.isArray(files.newImages)
            ? files.newImages
            : [files.newImages];
          newImageUrls = await uploadImagesToCloudinary(newImages);
        }

        // Handle deleted images
        let updatedImages = existingProduct.images;
        if (deletedImages) {
          const imagesToDelete = JSON.parse(deletedImages);
          updatedImages = updatedImages.filter(img => !imagesToDelete.includes(img));
        }

        // Combine existing images with new images
        // const updatedImages = [...existingProduct.images, ...newImageUrls];

        if (files.newImages) {
          const newImages = Array.isArray(files.newImages) ? files.newImages : [files.newImages];
          const newImageUrls = await uploadImagesToCloudinary(newImages);
          updatedImages = [...updatedImages, ...newImageUrls];
        }

        // Parse the addons field
        let parsedAddons = [];
        if (addons) {
          try {
            parsedAddons = JSON.parse(addons);
          } catch (parseError) {
            return responseReturn(res, 400, { error: "Invalid addons format" });
          }
        }

        let parsedBulkPricing = [];
        if (bulkPricing) {
          try {
            parsedBulkPricing = JSON.parse(bulkPricing);
          } catch (parseError) {
            return responseReturn(res, 400, { error: "Invalid bulk pricing format" });
          }
        }

        // Update the product
        const updatedProduct = await productModel.findByIdAndUpdate(
          productId,
          {
            name: name || "",
            description: description || "",
            discount: discount || 0,
            price: price || 0,
            brand: brand || "",
            stock: stock || 0,
            slug: slug || "",
            addons: parsedAddons,
            images: updatedImages,
            bulkPricing: parsedBulkPricing, 
          },
          { new: true }
        );

        responseReturn(res, 200, {
          product: updatedProduct,
          message: "Product updated successfully",
        });
      } catch (error) {
        responseReturn(res, 500, { error: error.message });
      }
    });
  };

  product_image_update = async (req, res) => {
    const form = formidable({ multiples: true });

    form.parse(req, async (err, field, files) => {
      const { productId, oldImage } = field;
      const { newImage } = files;

      if (err) {
        responseReturn(res, 404, { error: err.message });
      } else {
        try {
          cloudinary.config({
            cloud_name: process.env.cloud_name,
            api_key: process.env.api_key,
            api_secret: process.env.api_secret,
            secure: true,
          });
          const result = await cloudinary.uploader.upload(newImage.filepath, {
            folder: "products",
          });

          if (result) {
            let { images } = await productModel.findById(productId);
            const index = images.findIndex((img) => img === oldImage);
            images[index] = result.url;

            await productModel.findByIdAndUpdate(productId, {
              images,
            });

            const product = await productModel.findById(productId);
            responseReturn(res, 200, {
              product,
              message: "product image update success",
            });
          } else {
            responseReturn(res, 404, { error: "image upload failed" });
          }
        } catch (error) {
          responseReturn(res, 404, { error: error.message });
        }
      }
    });
  };

  


}

module.exports = new productController();
