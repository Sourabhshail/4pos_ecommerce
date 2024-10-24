const cardModel = require("../../models/cardModel");
const wishlistModel = require("../../models/wishlistModel");
const { responseReturn } = require("../../utiles/response");
const {
  mongo: { ObjectId },
} = require("mongoose");
const sellerModel=require("../../models/sellerModel")
class cardController {
  add_to_card = async (req, res) => {
    const {
      userId,
      productId,
      quantity,
      addons,
      price,
      bulkPricing,
      discountPrice,
    } = req.body;
    try {
      const product = await cardModel.findOne({
        $and: [
          {
            productId: {
              $eq: productId,
            },
          },
          {
            userId: {
              $eq: userId,
            },
          },
        ],
      });
      if (product) {
        responseReturn(res, 404, {
          error: "Product already added to cart",
        });
      } else {
        const product = await cardModel.create({
          userId,
          productId,
          quantity,
          addons,
          price,
          discountPrice,
          bulkPricing,
        });
        responseReturn(res, 201, {
          message: "Add to cart success",
          product,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  get_card_products = async (req, res) => {
  const co = 0;
  const { userId,sellerId  } = req.params;
  try {
     const getSellerDetails = await sellerModel.findById(sellerId);
    const card_products = await cardModel.aggregate([
      {
        $match: {
          userId: { $eq: new ObjectId(userId) },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "products",
        },
      },
    ]);

    console.log("getSellerDetails--> ",getSellerDetails);

    let buy_product_item = 0;
    let calculatePrice = 0;
    let card_product_count = 0;

    const calculateBulkPrice = (product, quantity) => {
      if (product.bulkPricing && product.bulkPricing.length > 0) {
        const sortedBulkPricing = [...product.bulkPricing].sort((a, b) => 
          parseInt(b.quantity) - parseInt(a.quantity)
        );
        
        for (let tier of sortedBulkPricing) {
          if (quantity >= parseInt(tier.quantity)) {
            return parseInt(tier.price);
          }
        }
      }
      return product.price;
    };

    const processedProducts = card_products.map(item => {
      const product = item.products[0];
      const isInStock = product.stock >= item.quantity;
      const bulkPrice = calculateBulkPrice(product, item.quantity);

      if (isInStock) {
        card_product_count += item.quantity;
        buy_product_item += item.quantity;
        calculatePrice += item.quantity * bulkPrice;
      }

      return {
        ...item,
        bulkPrice,
        isInStock,
        productInfo: {
          ...product,
          bulkPricing: product.bulkPricing
        }
      };
    });

    const outOfStockProduct = processedProducts.filter(p => !p.isInStock);
    const stockProduct = processedProducts.filter(p => p.isInStock);

    let p = [];
    let unique = [...new Set(stockProduct.map((p) => p.productInfo.sellerId.toString()))];

    for (let i = 0; i < unique.length; i++) {
      let sellerPrice = 0;
      const sellerProducts = [];

      for (let j = 0; j < stockProduct.length; j++) {
        const tempProduct = stockProduct[j].productInfo;
        if (unique[i] === tempProduct.sellerId.toString()) {
          let pri = stockProduct[j].bulkPrice;
          pri = pri - Math.floor((pri * co) / 100);
          sellerPrice += pri * stockProduct[j].quantity;
          
          sellerProducts.push({
            _id: stockProduct[j]._id,
            quantity: stockProduct[j].quantity,
            price: pri,
            bulkPrice: stockProduct[j].bulkPrice,
            addons: stockProduct[j].addons || [],
            productInfo: {
              _id: tempProduct._id,
              name: tempProduct.name,
              slug: tempProduct.slug,
              category: tempProduct.category,
              brand: tempProduct.brand,
              price: tempProduct.price,
              stock: tempProduct.stock,
              discount: tempProduct.discount,
              description: tempProduct.description,
              shopName: tempProduct.shopName,
              images: tempProduct.images,
              rating: tempProduct.rating,
              currency: tempProduct.currency,
              discountPrice: tempProduct.discountPrice,
              bulkPricing: tempProduct.bulkPricing,
            },
          });
        }
      }

      if (sellerProducts.length > 0) {
        p.push({
          sellerId: unique[i],
          shopName: sellerProducts[0].productInfo.shopName,
          price: sellerPrice,
          products: sellerProducts,
        });
      }
    }

    responseReturn(res, 200, {
      card_products: p,
      price: calculatePrice,
      card_product_count,
      shipping_fee: (getSellerDetails?.shippingFee || 0) * p.length,
      outOfStockProduct,
      buy_product_item,
    });
  } catch (error) {
    console.log(error.message);
    responseReturn(res, 500, { error: "An error occurred while processing your request" });
  }
};

  delete_card_product = async (req, res) => {
    const { card_id } = req.params;
    try {
      await cardModel.findByIdAndDelete(card_id);
      responseReturn(res, 200, {
        message: "success",
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  quantity_inc = async (req, res) => {
    const { card_id } = req.params;
    try {
      const product = await cardModel.findById(card_id);
      const { quantity } = product;
      await cardModel.findByIdAndUpdate(card_id, {
        quantity: quantity + 1,
      });
      responseReturn(res, 200, {
        message: "success",
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  
  quantity_dec = async (req, res) => {
    const { card_id } = req.params;
    try {
      const product = await cardModel.findById(card_id);
      const { quantity } = product;
      await cardModel.findByIdAndUpdate(card_id, {
        quantity: quantity - 1,
      });
      responseReturn(res, 200, {
        message: "success",
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  add_wishlist = async (req, res) => {
    const { slug } = req.body;

    console.log(req.body);

    try {
      const product = await wishlistModel.findOne({
        slug,
      });
      if (product) {
        responseReturn(res, 404, {
          error: "Allready added",
        });
      } else {
        await wishlistModel.create(req.body);
        responseReturn(res, 201, {
          message: "add to wishlist success",
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  get_wishlist = async (req, res) => {
    const { userId } = req.params;
    try {
      const wishlists = await wishlistModel.find({
        userId,
      });
      responseReturn(res, 200, {
        wishlistCount: wishlists.length,
        wishlists,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  delete_wishlist = async (req, res) => {
    const { wishlistId } = req.params;
    try {
      const wishlist = await wishlistModel.findByIdAndDelete(wishlistId);
      responseReturn(res, 200, {
        message: "Remove success",
        wishlistId,
      });
    } catch (error) {
      console.log(error.message);
    }
  };
}

module.exports = new cardController();
