import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { PropagateLoader } from "react-spinners";
import toast from "react-hot-toast";
import { get_category } from "../../store/Reducers/categoryReducer";
import {
  get_product,
  messageClear,
  update_product,
  product_image_update,
} from "../../store/Reducers/productReducer";
import { BsImages } from "react-icons/bs";
import { IoCloseSharp } from "react-icons/io5";
import { overrideStyle } from "../../utils/utils";
import EditAddonsSection from "./EditAddonsSection";
import EditBulkPricingSection from "./EditBulkPricingSection";

const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { categorys } = useSelector((state) => state.category);
  const { product, loader, errorMessage, successMessage } = useSelector(
    (state) => state.product
  );
 const { userInfo } = useSelector((state) => state.auth);
  const [state, setState] = useState({
    name: "",
    description: "",
    discount: "",
    price: "",
    brand: "",
    stock: "",
  });
  const [category, setCategory] = useState("");
  const [cateShow, setCateShow] = useState(false);
  const [allCategory, setAllCategory] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [imageShow, setImageShow] = useState([]);
  const [addons, setAddons] = useState([]);
  const [activeTab, setActiveTab] = useState("product");
  const [errors, setErrors] = useState({});
  const [deletedImages, setDeletedImages] = useState([]);
  const [bulkPricing, setBulkPricing] = useState([{ quantity: "", price: "" }]);
  useEffect(() => {
    dispatch(
      get_category({
        searchValue: "",
        parPage: "",
        page: "",
      })
    );
    dispatch(get_product(productId));
  }, [dispatch, productId]);

  useEffect(() => {
    if (product) {
      setState({
        name: product.name,
        description: product.description,
        discount: product.discount,
        price: product.price,
        brand: product.brand,
        stock: product.stock,
        currency: userInfo?.currency.symbol,
      });
      setCategory(product.category);
      setImageShow(product.images);
      setAddons(product.addons || []);
      setBulkPricing(product.bulkPricing || []);
    }
  }, [product]);

  useEffect(() => {
    if (categorys.length > 0) {
      setAllCategory(categorys);
    }
  }, [categorys]);

  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const categorySearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (value) {
      let srcValue = allCategory.filter(
        (c) => c.name.toLowerCase().indexOf(value.toLowerCase()) > -1
      );
      setAllCategory(srcValue);
    } else {
      setAllCategory(categorys);
    }
  };

  const [newImages, setNewImages] = useState([]);

  const changeImage = (img, files) => {
    if (files.length > 0) {
      dispatch(
        product_image_update({
          oldImage: img,
          newImage: files[0],
          productId,
        })
      );
    }
  };

  const addNewImage = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      setNewImages([...newImages, ...files]);
      setImageShow([
        ...imageShow,
        ...Array.from(files).map((file) => URL.createObjectURL(file)),
      ]);
    }
  };

  const removeNewImage = (index) => {
    const updatedNewImages = newImages.filter((_, i) => i !== index);
    const updatedImageShow = imageShow.filter(
      (_, i) => i !== index + product.images.length
    );
    setNewImages(updatedNewImages);
    setImageShow(updatedImageShow);
  };

  // new
  const removeImage = (index) => {
    const imageToDelete = imageShow[index];
    setDeletedImages([...deletedImages, imageToDelete]);
    const updatedImageShow = imageShow.filter((_, i) => i !== index);
    setImageShow(updatedImageShow);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const validateForm = () => {
    const newErrors = {};
    const errorMessages = []; // Array to collect error messages

    // Validate product details
    if (!state.name) {
      const message = "Product name is required";
      newErrors.name = message;
      errorMessages.push(message);
    }

    if (!state.price || state.price <= 0) {
      const message = "Price must be greater than 0";
      newErrors.price = message;
      errorMessages.push(message);
    }

    if (!state.stock || state.stock < 0) {
      const message = "Stock cannot be negative";
      newErrors.stock = message;
      errorMessages.push(message);
    }

    if (!category) {
      const message = "Category is required";
      newErrors.category = message;
      errorMessages.push(message);
    }

    if (imageShow.length === 0) {
      const message = "At least one image is required";
      newErrors.images = message;
      errorMessages.push(message);
    }

    if (bulkPricing && bulkPricing.length > 0 && bulkPricing[0]?.quantity && bulkPricing[0]?.price) {
      bulkPricing.forEach((pricing, index) => {
        if (!pricing.quantity || pricing.quantity <= 1) {
          newErrors[`bulk_pricing_quantity_${index}`] =
            "Quantity must be greater than 1";
          errorMessages.push(
            `Bulk pricing quantity must be greater than 1`
          );
        }
        if (!pricing.price || pricing.price <= 0) {
          newErrors[`bulk_pricing_price_${index}`] =
            "Price must be greater than 0";
          errorMessages.push(
            `Bulk pricing price must be greater than 0`
          );
        }
      });
    }

    if (errorMessages.length > 0) {
      errorMessages.forEach((message) => {
        toast.error(message); // Display each message using Toast
      });
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const update = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("name", state.name);
    formData.append("description", state.description);
    formData.append("price", state.price);
    formData.append("stock", state.stock);
    formData.append("category", category);
    formData.append("discount", state.discount);
    formData.append("brand", state.brand);
    formData.append("addons", JSON.stringify(addons));
    formData.append("productId", productId);
    formData.append("bulkPricing", JSON.stringify(bulkPricing));
    formData.append("currency", userInfo?.currency.symbol);

    // Append new images
    newImages.forEach((image, index) => {
      formData.append(`newImages`, image);
    });
    formData.append("deletedImages", JSON.stringify(deletedImages));

    dispatch(update_product(formData));
  };

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      navigate("/seller/dashboard/products");
    }
  }, [successMessage, errorMessage, dispatch]);

  return (
    <div className="px-2 lg:px-7 pt-5 ">
      <div className="w-full p-4 bg-[#ffffff] rounded-md">
        <div className="flex justify-between items-center pb-4">
          <h1 className="text-[#000000] text-xl font-semibold">Edit Product</h1>
          <Link
            className="bg-blue-500 hover:shadow-blue-500/50 hover:shadow-lg text-white rounded-sm px-7 py-2 my-2"
            to="/seller/dashboard/products"
          >
            Products
          </Link>
        </div>
        <div>
          <div className="flex mb-4">
            <button
              onClick={() => handleTabChange("product")}
              className={`px-4 py-2 mr-2 ${
                activeTab === "product"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              } rounded-t-lg`}
            >
              Product Details
            </button>
            <button
              onClick={() => handleTabChange("addons")}
              className={`px-4 py-2 mr-2 ${
                activeTab === "addons"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              } rounded-t-lg`}
            >
              Options
            </button>
            <button
              onClick={() => handleTabChange("images")}
              className={`px-4 py-2 ${
                activeTab === "images"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              } rounded-t-lg`}
            >
              Product Gallery
            </button>
            <button
              onClick={() => handleTabChange("bulkPricing")}
              className={`px-4 py-2 mr-2 ml-2 ${
                activeTab === "bulkPricing"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              } rounded-t-lg`}
            >
              Bulk Pricing
            </button>
          </div>

          <form onSubmit={update}>
            {activeTab === "product" && (
              <div>
                <div className="flex flex-col mb-3 md:flex-row gap-4 w-full text-[#000000]">
                  <div className="flex flex-col w-full gap-1">
                    <label htmlFor="name">Product name</label>
                    <input
                      className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#ffffff] border border-slate-700 rounded-md text-[#000000]"
                      onChange={inputHandle}
                      value={state.name}
                      type="text"
                      placeholder="product name"
                      name="name"
                      id="name"
                    />
                    {errors.name && (
                      <span className="text-red-500">{errors.name}</span>
                    )}
                  </div>
                  <div className="flex flex-col w-full gap-1">
                    <label htmlFor="brand">Product brand</label>
                    <input
                      className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#ffffff] border border-slate-700 rounded-md text-[#000000]"
                      onChange={inputHandle}
                      value={state.brand}
                      type="text"
                      placeholder="product brand"
                      name="brand"
                      id="brand"
                    />
                    {errors.brand && (
                      <span className="text-red-500">{errors.brand}</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col mb-3 md:flex-row gap-4 w-full text-[#000000]">
                  <div className="flex flex-col w-full gap-1 relative">
                    <label htmlFor="category">Category</label>
                    <input
                      readOnly
                      onClick={() => setCateShow(!cateShow)}
                      className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#ffffff] border border-slate-700 rounded-md text-[#000000]"
                      onChange={inputHandle}
                      value={category}
                      type="text"
                      placeholder="--select category--"
                      id="category"
                    />
                    {errors.category && (
                      <span className="text-red-500">{errors.category}</span>
                    )}
                    <div
                      className={`absolute top-[101%] bg-slate-800 w-full transition-all ${
                        cateShow ? "scale-100" : "scale-0"
                      }`}
                    >
                      <div className="w-full px-4 py-2 fixed">
                        <input
                          value={searchValue}
                          onChange={categorySearch}
                          className="px-3 py-1 w-full focus:border-indigo-500 outline-none bg-transparent border border-slate-700 rounded-md text-[#000000] overflow-hidden"
                          type="text"
                          placeholder="search"
                        />
                      </div>
                      <div className="pt-14"></div>
                      <div className="flex justify-start items-start flex-col h-[200px] overflow-x-scrool">
                        {allCategory.length > 0 &&
                          allCategory.map((c, i) => (
                            <span
                              className={`px-4 py-2 hover:bg-indigo-500 hover:text-white hover:shadow-lg w-full cursor-pointer ${
                                category === c.name && "bg-indigo-500"
                              }`}
                              onClick={() => {
                                setCateShow(false);
                                setCategory(c.name);
                                setSearchValue("");
                                setAllCategory(categorys);
                              }}
                            >
                              {c.name}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col w-full gap-1">
                    <label htmlFor="stock">Stock</label>
                    <input
                      className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#ffffff] border border-slate-700 rounded-md text-[#000000]"
                      onChange={inputHandle}
                      value={state.stock}
                      type="number"
                      min="0"
                      placeholder="product stock"
                      name="stock"
                      id="stock"
                    />

                    {errors.stock && (
                      <span className="text-red-500">{errors.stock}</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col mb-3 md:flex-row gap-4 w-full text-[#000000]">
                  <div className="flex flex-col w-full gap-1">
                    <label htmlFor="price">Price</label>
                    <input
                      className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#ffffff] border border-slate-700 rounded-md text-[#000000]"
                      onChange={inputHandle}
                      value={state.price}
                      type="number"
                      placeholder="price"
                      name="price"
                      id="price"
                    />
                    {errors.price && (
                      <span className="text-red-500">{errors.price}</span>
                    )}
                  </div>
                  <div className="flex flex-col w-full gap-1">
                    <label htmlFor="discount">Discount</label>
                    <input
                      className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#ffffff] border border-slate-700 rounded-md text-[#000000]"
                      onChange={inputHandle}
                      value={state.discount}
                      type="number"
                      placeholder="%discount%"
                      name="discount"
                      id="discount"
                    />
                    {errors.discount && (
                      <span className="text-red-500">{errors.discount}</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col w-full gap-1 text-[#000000] mb-5">
                  <label htmlFor="description">Description</label>
                  <textarea
                    rows={4}
                    className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#ffffff] border border-slate-700 rounded-md text-[#000000]"
                    onChange={inputHandle}
                    value={state.description}
                    placeholder="description"
                    name="description"
                    id="description"
                  ></textarea>
                  {errors.description && (
                    <span className="text-red-500">{errors.description}</span>
                  )}
                </div>{" "}
              </div>
            )}
            {activeTab === "addons" && (
              <EditAddonsSection
                addons={addons}
                setAddons={setAddons}
                errors={errors}
              />
            )}
            {activeTab === "images" && (
              <div className="grid lg:grid-cols-4 grid-cols-1 md:grid-cols-3 sm:grid-cols-2 sm:gap-4 md:gap-4 xs:gap-4 gap-3 w-full text-[#000000] mb-4">
                {imageShow.map((img, i) => (
                  <div key={i} className="relative">
                    <label className="h-[180px]" htmlFor={i}>
                      <img
                        className="h-full w-full object-cover"
                        src={img}
                        alt=""
                      />
                    </label>
                    <input
                      onChange={(e) => changeImage(img, e.target.files)}
                      type="file"
                      id={i}
                      className="hidden"
                    />
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                    >
                      <IoCloseSharp size={20} />
                    </button>
                  </div>
                ))}
                <label
                  className="flex justify-center items-center flex-col h-[180px] cursor-pointer border border-dashed hover:border-indigo-500 w-full text-[#000000]"
                  htmlFor="newImage"
                >
                  <span>
                    <BsImages />
                  </span>
                  <span>Add new image</span>
                </label>
                <input
                  type="file"
                  id="newImage"
                  className="hidden"
                  multiple
                  onChange={addNewImage}
                />
              </div>
            )}
            {activeTab === "bulkPricing" && (
              <EditBulkPricingSection
                bulkPricing={bulkPricing}
                setBulkPricing={setBulkPricing}
                errors={errors}
              />
            )}
            <div className="flex">
              <button
                disabled={loader ? true : false}
                className="bg-blue-500 w-[190px] hover:shadow-blue-500/20 hover:shadow-lg text-white rounded-md px-7 py-2 mb-3"
              >
                {loader ? (
                  <PropagateLoader color="#fff" cssOverride={overrideStyle} />
                ) : (
                  "Update product"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
