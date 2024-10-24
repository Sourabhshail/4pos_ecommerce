const adminModel = require("../models/adminModel");
const sellerModel = require("../models/sellerModel");
const countryModel = require("../models/countryModel");
const currencyModel = require("../models/currencyModel");
const sellerCustomerModel = require("../models/chat/sellerCustomerModel");
const bcrpty = require("bcrypt");
const formidable = require("formidable");
const cloudinary = require("cloudinary").v2;
const { responseReturn } = require("../utiles/response");
const { createToken } = require("../utiles/tokenCreate");
class authControllers {
  admin_login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const admin = await adminModel.findOne({ email }).select("+password");
      if (admin) {
        const match = await bcrpty.compare(password, admin.password);
        if (match) {
          const token = await createToken({
            id: admin.id,
            role: admin.role,
          });
          res.cookie("accessToken", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          });
          responseReturn(res, 200, { token, message: "Login success" });
        } else {
          responseReturn(res, 404, { error: "Password wrong" });
        }
      } else {
        responseReturn(res, 404, { error: "Email not found" });
      }
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  seller_login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const seller = await sellerModel.findOne({ email }).select("+password");
      if (seller) {
        const match = await bcrpty.compare(password, seller.password);
        if (match) {
          const token = await createToken({
            id: seller.id,
            role: seller.role,
          });
          res.cookie("accessToken", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          });
          responseReturn(res, 200, { token, message: "Login success" });
        } else {
          responseReturn(res, 404, { error: "Password wrong" });
        }
      } else {
        responseReturn(res, 404, { error: "Email not found" });
      }
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  seller_register = async (req, res) => {
    const { email, name, password, countryId, currencyId } = req.body;
    try {
      const getUser = await sellerModel.findOne({ email });
      if (getUser) {
        responseReturn(res, 404, { error: "Email already exists" });
      } else {
        const country = await countryModel.findById(countryId);
        const currency = await currencyModel.findById(currencyId);

        if (!country || !currency) {
          responseReturn(res, 404, { error: "Invalid country or currency" });
          return;
        }

        const seller = await sellerModel.create({
          name,
          email,
          password: await bcrpty.hash(password, 10),
          method: "manually",
          shopInfo: {},
          country: countryId,
          currency: currencyId,
        });

        await sellerCustomerModel.create({
          myId: seller.id,
        });

        const token = await createToken({ id: seller.id, role: seller.role });
        res.cookie("accessToken", token, {
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        responseReturn(res, 201, { token, message: "Register success" });
      }
    } catch (error) {
      console.log(error);
      responseReturn(res, 500, { error: "Internal server error" });
    }
  };

  getUser = async (req, res) => {
    const { id, role } = req;
    try {
      if (role === "admin") {
        const user = await adminModel
          .findById(id)
          .populate("country")
          .populate("currency");
        responseReturn(res, 200, { userInfo: user });
      } else {
        const seller = await sellerModel
          .findById(id)
          .populate("country")
          .populate("currency");
        responseReturn(res, 200, { userInfo: seller });
      }
    } catch (error) {
      responseReturn(res, 500, { error: "Internal server error" });
    }
  };

  profile_image_upload = async (req, res) => {
    const { id } = req;
    const form = formidable({ multiples: true });
    form.parse(req, async (err, _, files) => {
      cloudinary.config({
        cloud_name: process.env.cloud_name,
        api_key: process.env.api_key,
        api_secret: process.env.api_secret,
        secure: true,
      });
      const { image } = files;
      try {
        const result = await cloudinary.uploader.upload(image.filepath, {
          folder: "profile",
        });
        if (result) {
          await sellerModel.findByIdAndUpdate(id, {
            image: result.url,
          });
          const userInfo = await sellerModel.findById(id);
          responseReturn(res, 201, {
            message: "image upload success",
            userInfo,
          });
        } else {
          responseReturn(res, 404, { error: "image upload failed" });
        }
      } catch (error) {
        //console.log(error)
        responseReturn(res, 500, { error: error.message });
      }
    });
  };

  profile_info_add = async (req, res) => {
    const { division, district, shopName, sub_district, shippingFee } =
      req.body;
    const { id } = req;

    try {
      await sellerModel.findByIdAndUpdate(id, {
        shopInfo: {
          shopName,
          division,
          district,
          sub_district,
        },
        shippingFee: shippingFee || 0,
      });
      const userInfo = await sellerModel.findById(id);
      responseReturn(res, 201, {
        message: "Profile info add success",
        userInfo,
      });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  logout = async (req, res) => {
    try {
      res.cookie("accessToken", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      });
      responseReturn(res, 200, { message: "logout success" });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  getAllCountries = async (req, res) => {
    try {
      const countries = await countryModel.find({});
      responseReturn(res, 200, { countries });
    } catch (error) {
      responseReturn(res, 500, { error: "Internal server error" });
    }
  };

  getAllCurrencies = async (req, res) => {
    try {
      const currencies = await currencyModel.find({});
      responseReturn(res, 200, { currencies });
    } catch (error) {
      responseReturn(res, 500, { error: "Internal server error" });
    }
  };

  updateCountryAndCurrency = async (req, res) => {
    const { id, role } = req;
    const { countryId, currencyId } = req.body;

    try {
      const country = await countryModel.findById(countryId);
      const currency = await currencyModel.findById(currencyId);

      if (!country || !currency) {
        responseReturn(res, 404, { error: "Invalid country or currency" });
        return;
      }
      if (role == "admin") {
        await adminModel.findByIdAndUpdate(id, {
          country: countryId,
          currency: currencyId,
        });
        const updatedAdmin = await adminModel
          .findById(id)
          .populate("country")
          .populate("currency");
        responseReturn(res, 200, {
          message: "Country and currency updated successfully",
          userInfo: updatedAdmin,
        });
      } else {
        await sellerModel.findByIdAndUpdate(id, {
          country: countryId,
          currency: currencyId,
        });

        const updatedSeller = await sellerModel
          .findById(id)
          .populate("country")
          .populate("currency");

        responseReturn(res, 200, {
          message: "Country and currency updated successfully",
          userInfo: updatedSeller,
        });
      }
    } catch (error) {
      responseReturn(res, 500, { error: "Internal server error" });
    }
  };

  updateProfile = async (req, res) => {
    const { id, role } = req;
    const { name, address } = req.body;
    try {
      let updatedUser;
      if (role === "admin") {
        await adminModel.findByIdAndUpdate(id, {
          name,
          address,
        });
        updatedUser = await adminModel.findById(id);
      } else {
        await sellerModel.findByIdAndUpdate(id, {
          name,
          address,
        });
        updatedUser = await sellerModel.findById(id);
      }

      responseReturn(res, 200, {
        message: "Profile updated successfully",
        userInfo: updatedUser,
      });
    } catch (error) {
      responseReturn(res, 500, { error: "Internal server error" });
    }
  };
  updateShopInfo = async (req, res) => {
    const { id, role } = req;
    const { shopName, division, district, sub_district, shippingFee } =
      req.body;

    if (role !== "seller") {
      responseReturn(res, 403, { error: "Only sellers can update shop info" });
      return;
    }
    try {
      await sellerModel.findByIdAndUpdate(id, {
        shopInfo: {
          shopName,
          division,
          district,
          sub_district,
        },
        shippingFee: shippingFee || 0,
      });

      const updatedSeller = await sellerModel.findById(id);

      responseReturn(res, 200, {
        message: "Shop info updated successfully",
        userInfo: updatedSeller,
      });
    } catch (error) {
      responseReturn(res, 500, { error: "Internal server error" });
    }
  };

  getSupportInfo = async (req, res) => {
    const { id } = req;
    try {
      const seller = await sellerModel.findById(id);
      if (!seller) {
        return responseReturn(res, 404, { error: "Seller not found" });
      }
      responseReturn(res, 200, { supportInfo: seller.support });
    } catch (error) {
      responseReturn(res, 500, { error: "Internal server error" });
    }
  };

  getSupportInfoBySellerId = async (req, res) => {
    const { sellerId } = req.params;
    try {
      const seller = await sellerModel.findById(sellerId);
      if (!seller) {
        return responseReturn(res, 404, { error: "Seller not found" });
      }
      responseReturn(res, 200, { supportInfo: seller.support });
    } catch (error) {
      responseReturn(res, 500, { error: "Internal server error" });
    }
  };

  updateSupportInfo = async (req, res) => {
    const { id } = req;
    const { mobileNo, email, address, logo } = req.body;
    try {
      const updatedSeller = await sellerModel.findByIdAndUpdate(
        id,
        { support: { mobileNo, email, address, logo } },
        { new: true }
      );
      if (!updatedSeller) {
        return responseReturn(res, 404, { error: "Seller not found" });
      }
      responseReturn(res, 200, {
        message: "Support info updated successfully",
        supportInfo: updatedSeller.support,
      });
    } catch (error) {
      responseReturn(res, 500, { error: "Internal server error" });
    }
  };

  support_logo_upload = async (req, res) => {
    const { id } = req;
    const form = formidable({ multiples: true });
    form.parse(req, async (err, _, files) => {
      cloudinary.config({
        cloud_name: process.env.cloud_name,
        api_key: process.env.api_key,
        api_secret: process.env.api_secret,
        secure: true,
      });
      const { logo } = files;
      try {
        const result = await cloudinary.uploader.upload(logo.filepath, {
          folder: "support_logos",
        });
        if (result) {
          const updatedSeller = await sellerModel.findByIdAndUpdate(
            id,
            { "support.logo": result.url },
            { new: true }
          );
          responseReturn(res, 201, {
            message: "Support logo upload success",
            supportInfo: updatedSeller.support,
          });
        } else {
          responseReturn(res, 404, { error: "Support logo upload failed" });
        }
      } catch (error) {
        responseReturn(res, 500, { error: error.message });
      }
    });
  };
  searchSellerByName = async (req, res) => {
    const { name } = req.query;

    if (!name) {
      return responseReturn(res, 400, { error: "Name parameter is required" });
    }

    try {
      const lowercaseName = name.toLowerCase();
      const seller = await sellerModel
        .findOne({
          name: { $regex: new RegExp(`^${lowercaseName}$`, "i") },
        })
        .select("_id name");

      if (seller) {
        responseReturn(res, 200, {
          seller: { id: seller._id, name: seller.name },
        });
      } else {
        responseReturn(res, 200, { seller: null });
      }
    } catch (error) {
      responseReturn(res, 500, { error: "Internal server error" });
    }
  };

  searchSellerById = async (req, res) => {
    const { id } = req.query;

    if (!id) {
      return responseReturn(res, 400, { error: "Id parameter is required" });
    }

    try {
      const seller = await sellerModel.findById(id).select("_id name");
      if (seller) {
        responseReturn(res, 200, {
          seller: { id: seller._id, name: seller.name },
        });
      } else {
        responseReturn(res, 404, { error: "Seller not found" });
      }
    } catch (error) {
      responseReturn(res, 500, { error: "Internal server error" });
    }
  };
}
module.exports = new authControllers();
