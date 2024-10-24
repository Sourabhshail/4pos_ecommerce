import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineKeyboardArrowRight, MdDeleteOutline } from "react-icons/md";
import { FiMinus, FiPlus } from "react-icons/fi";
import Headers from "../components/Headers";
import Footer from "../components/Footer";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import {
  get_card_products,
  delete_card_product,
  messageClear,
  quantity_inc,
  quantity_dec,
} from "../store/reducers/cardReducer";
import { get_banners } from "../store/reducers/homeReducer";

const Card = ({ sellerId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const { banners } = useSelector((state) => state.home);
  const {
    card_products = [],
    successMessage,
    price = 0,
    buy_product_item = 0,
    shipping_fee = 0,
    outOfStockProduct = [],
  } = useSelector((state) => state.card);

  const [currencySymbol, setCurrencySymbol] = useState("R");

  const responsiveBanner = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 1 },
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1 },
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 1 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
  };

  useEffect(() => {
    if (userInfo && userInfo.id) {
      dispatch(get_card_products({ userId: userInfo.id, sellerId }));
      dispatch(get_banners(sellerId));
    }
  }, [userInfo, sellerId]);
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      if (userInfo && userInfo.id) {
        dispatch(get_card_products({ userId: userInfo.id, sellerId }));
      }
    }
  }, [successMessage]);

  const redirect = () => {
    const addons = card_products.flatMap((seller) =>
      seller.products.flatMap((product) => product.addons || [])
    );

    navigate(`/${sellerId}/shipping`, {
      state: {
        products: card_products,
        price: price,
        shipping_fee: shipping_fee,
        items: buy_product_item,
        addons: addons,
      },
    });
  };

  const inc = (quantity, stock, card_id) => {
    const temp = quantity + 1;
    if (temp <= stock) {
      dispatch(quantity_inc(card_id));
    }
  };

  const dec = (quantity, card_id) => {
    const temp = quantity - 1;
    if (temp !== 0) {
      dispatch(quantity_dec(card_id));
    }
  };

  const calculateDiscountedPrice = (product) => {
    if (!product || !product.productInfo) return 0;

    const { price = 0, discount = 0, bulkPricing = [] } = product.productInfo;
    const quantity = product.quantity || 1;

    if (bulkPricing.length > 0) {
      const sortedBulkPricing = [...bulkPricing].sort(
        (a, b) => (b.quantity || 0) - (a.quantity || 0)
      );
      const applicableBulkPrice = sortedBulkPricing.find(
        (bp) => quantity >= (bp.quantity || 0)
      );
      if (applicableBulkPrice) {
        return applicableBulkPrice.price || 0;
      }
    }

    return price - Math.floor((price * discount) / 100);
  };

  const CartItem = ({ product }) => {
    if (!product || !product.productInfo) return null;

    const discountedPrice = calculateDiscountedPrice(product);
    const originalPrice = product.productInfo.price || 0;
    const totalDiscount =
      originalPrice > 0
        ? (((originalPrice - discountedPrice) / originalPrice) * 100).toFixed(2)
        : 0;

    const getBulkPricingInfo = () => {
      const { bulkPricing = [] } = product.productInfo;
      if (bulkPricing.length > 0) {
        const sortedBulkPricing = [...bulkPricing].sort(
          (a, b) => (a.quantity || 0) - (b.quantity || 0)
        );
        return sortedBulkPricing.map((bp, index) => (
          <div key={index} className="text-xs text-gray-600">
            {bp.quantity || 0}+ items: {currencySymbol}
            {(bp.price || 0).toFixed(2)} each
          </div>
        ));
      }
      return null;
    };

    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-4 transition-all hover:shadow-lg">
        <div className="flex items-center">
          <img
            className="w-20 h-20 object-cover rounded"
            src={product.productInfo.images?.[0] || ""}
            alt={product.productInfo.name || "Product image"}
          />
          <div className="ml-4 flex-grow">
            <h3 className="font-semibold text-lg">
              {product.productInfo.name || "Unnamed Product"}
            </h3>
            <p className="text-sm text-gray-500">
              Brand: {product.productInfo.brand || "Unknown"}
            </p>
            {/* {product.addons && product.addons.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-700">Addons:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {product.addons.map((addon, index) => (
                    <span
                      key={index}
                      className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-1"
                    >
                      {addon.text || ""} ({currencySymbol}
                      {(addon.price || 0).toFixed(2)})
                    </span>
                  ))}
                </div>
              </div>
            )}
            {getBulkPricingInfo()} */}
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-green-600">
              {currencySymbol}
              {discountedPrice.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 line-through">
              {currencySymbol}
              {originalPrice.toFixed(2)}
            </p>
            <p className="text-sm text-red-500">-{totalDiscount}%</p>
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center border rounded-md">
            <button
              onClick={() => dec(product.quantity || 1, product._id)}
              className="p-2 hover:bg-gray-100"
            >
              <FiMinus size={16} />
            </button>
            <span className="px-4 py-2 font-medium">
              {product.quantity || 1}
            </span>
            <button
              onClick={() =>
                inc(
                  product.quantity || 1,
                  product.productInfo.stock || 0,
                  product._id
                )
              }
              className="p-2 hover:bg-gray-100"
            >
              <FiPlus size={16} />
            </button>
          </div>
          <button
            onClick={() => dispatch(delete_card_product(product._id))}
            className="text-red-500 hover:text-red-700 transition-colors"
          >
            <MdDeleteOutline size={24} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
    <Headers sellerId={sellerId} />
      <section className="h-[220px] mt-6 bg-cover bg-no-repeat relative bg-left">
        <Carousel
          autoPlay={true}
          infinite={true}
          arrows={false}
          showDots={false}
          responsive={responsiveBanner}
          className="h-full"
        >
          {banners &&
            banners.length > 0 &&
            banners.map((b, i) => (
              <div key={i} className="h-full w-full">
                <img
                  className="w-full h-full object-cover"
                  src={b.banner}
                  alt=""
                />
              </div>
            ))}
        </Carousel>
        <div className="absolute left-0 top-0 w-full h-full bg-[#2422228a]">
          <div className="w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto">
            <div className="flex flex-col justify-center gap-1 items-center h-full w-full text-white">
              <div className="flex justify-center items-center gap-2 text-2xl w-full">
                <Link to={`/${sellerId}`}>Home</Link>
                <span className="pt-2">
                  <MdOutlineKeyboardArrowRight />
                </span>
                <span>Cart</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-gray-100">
        <div className="w-[85%] lg:w-[90%] md:w-[90%] sm:w-[90%] mx-auto py-16">
          {card_products.length > 0 || outOfStockProduct.length > 0 ? (
            <div className="flex flex-wrap gap-8">
              <div className="w-[67%] md-lg:w-full">
                <div className="pr-3 md-lg:pr-0">
                  <div className="flex flex-col gap-3">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h2 className="text-lg font-semibold text-green-600">
                        In Stock Products ({card_products.length})
                      </h2>
                    </div>
                    {card_products.map((seller, i) => (
                      <div
                        key={i}
                        className="bg-white p-4 rounded-lg shadow-sm"
                      >
                        <h3 className="text-lg font-semibold mb-4">
                          {seller.shopName || "Unknown Shop"}
                        </h3>
                        {(seller.products || []).map((product, j) => (
                          <CartItem key={j} product={product} />
                        ))}
                      </div>
                    ))}
                    {outOfStockProduct.length > 0 && (
                      <div className="bg-white p-4 rounded-lg shadow-sm mt-8">
                        <h2 className="text-lg font-semibold text-red-500 mb-4">
                          Out of Stock Products ({outOfStockProduct.length})
                        </h2>
                        {outOfStockProduct.map((product, i) => (
                          <CartItem key={i} product={product} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="w-[30%] md-lg:w-full">
                <div className="pl-3 md-lg:pl-0 md-lg:mt-5">
                  {card_products.length > 0 && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-600">
                          {buy_product_item} Item(s)
                        </span>
                        <span className="font-semibold">
                          {currencySymbol}
                          {price.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-600">Shipping Fee</span>
                        <span className="font-semibold">
                          {currencySymbol}
                          {shipping_fee.toFixed(2)}
                        </span>
                      </div>
                      {/* <div className="flex gap-2 mb-6">
                        <input
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          type="text"
                          placeholder="Coupon Code"
                        />
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                          Apply
                        </button>
                      </div> */}
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-lg font-semibold">Total</span>
                        <span className="text-xl font-bold text-green-600">
                          {currencySymbol}
                          {(price + shipping_fee).toFixed(2)}
                        </span>
                      </div>
                      <button
                        onClick={redirect}
                        className="w-full py-3 rounded-md bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors"
                      >
                        Proceed to Checkout ({buy_product_item})
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
              <Link
                className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors inline-block"
                to={`/${sellerId}/shops`}
              >
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </section>
      <Footer sellerId={sellerId} />
    </div>
  );
};

export default Card;
