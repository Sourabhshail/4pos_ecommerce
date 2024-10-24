import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsImages } from "react-icons/bs";
import { IoCloseSharp } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { PropagateLoader } from "react-spinners";
import { overrideStyle } from "../../utils/utils";
import { get_category } from "../../store/Reducers/categoryReducer";
import { add_product, messageClear } from "../../store/Reducers/productReducer";
import AddonsSection from "./AddonsSection";
import BulkUploadSection from "./BulkUploadSection";

const AddProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categorys } = useSelector((state) => state.category);
  const { successMessage, errorMessage, loader } = useSelector(
    (state) => state.product
  );

  const { userInfo } = useSelector((state) => state.auth);
  
  console.log();

  const [state, setState] = useState({
    name: "",
    description: "",
    discount: "",
    price: "",
    brand: "",
    stock: "",
  });

  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
  const [imageShow, setImageShow] = useState([]);
  const [cateShow, setCateShow] = useState(false);
  const [allCategory, setAllCategory] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [activeTab, setActiveTab] = useState("product");

  const [addons, setAddons] = useState([{ question: "", options: [] }]);
  const [errors, setErrors] = useState({});
  const [bulkPricing, setBulkPricing] = useState([{ quantity: "", price: "" }]);

  useEffect(() => {
    dispatch(
      get_category({
        searchValue: "",
        parPage: "",
        page: "",
      })
    );
  }, []);

  useEffect(() => {
    setAllCategory(categorys);
  }, [categorys]);

  const inputHandle = (e) => {
    const { name, value } = e.target;
    setState({
      ...state,
      [name]: value,
    });

    // Validate inputs
    if (name === "name" && !value) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: "Product name is required",
      }));
    } else if (name === "price" && (!value || value <= 0)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        price: "Price must be greater than 0",
      }));
    } else if (name === "stock" && (!value || value < 0)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        stock: "Stock cannot be negative",
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
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

  const inmageHandle = (e) => {
    const files = e.target.files;
    const length = files.length;

    if (length > 0) {
      setImages([...images, ...files]);
      let imageUrl = [];

      for (let i = 0; i < length; i++) {
        imageUrl.push({ url: URL.createObjectURL(files[i]) });
      }
      setImageShow([...imageShow, ...imageUrl]);
      setErrors((prevErrors) => ({ ...prevErrors, images: "" }));
    }
  };

  const changeImage = (img, index) => {
    if (img) {
      let tempUrl = imageShow;
      let tempImages = images;

      tempImages[index] = img;
      tempUrl[index] = { url: URL.createObjectURL(img) };
      setImageShow([...tempUrl]);
      setImages([...tempImages]);
    }
  };

  const removeImage = (i) => {
    const filterImage = images.filter((img, index) => index !== i);
    const filterImageUrl = imageShow.filter((img, index) => index !== i);
    setImages(filterImage);
    setImageShow(filterImageUrl);
    if (filterImage.length === 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        images: "At least one image is required",
      }));
    }
  };

  const handleTabChange = (tab) => {
    // if (tab === "addons" && !state.name) {
    //   toast.error("Please fill in the product name before moving to Options");
    //   return;
    // }
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

    if (images.length === 0) {
      const message = "At least one image is required";
      newErrors.images = message;
      errorMessages.push(message);
    }

    if (
      bulkPricing &&
      bulkPricing.length > 0 &&
      bulkPricing[0]?.quantity &&
      bulkPricing[0]?.price
    ) {
      bulkPricing.forEach((pricing, index) => {
        if (!pricing.quantity || pricing.quantity <= 1) {
          newErrors[`bulk_pricing_quantity_${index}`] =
            "Quantity must be greater than 1";
          errorMessages.push(`Bulk pricing quantity  must be greater than 1`);
        }
        if (!pricing.price || pricing.price <= 0) {
          newErrors[`bulk_pricing_price_${index}`] =
            "Price must be greater than 0";
          errorMessages.push(`Bulk pricing price  must be greater than 0`);
        }
      });
    }

    // No need to validate addons if they're optional

    // Set errors in the state
    setErrors(newErrors);

    // Show error messages in Toast
    if (errorMessages.length > 0) {
      errorMessages.forEach((message) => {
        toast.error(message); // Display each message using Toast
      });
    }

    // Return whether the form is valid or not
    return Object.keys(newErrors).length === 0;
  };

  const add = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("name", state.name);
    formData.append("description", state.description);
    formData.append("price", state.price);
    formData.append("stock", state.stock);
    formData.append("category", category);
    formData.append("discount", state.discount);
    formData.append("shopName", userInfo?.shopInfo?.shopName);
    formData.append("brand", state.brand);
    formData.append("bulkPricing", JSON.stringify(bulkPricing));
    formData.append("currency", userInfo?.currency.symbol);

    // Only include addons if they exist
    const processedAddons = addons.filter(
      (addon) => addon.question || addon.options.length > 0
    );
    if (processedAddons.length > 0) {
      formData.append("addons", JSON.stringify(processedAddons));
    }

    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }
    dispatch(add_product(formData));
  };

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      setState({
        name: "",
        description: "",
        discount: "",
        price: "",
        brand: "",
        stock: "",
      });
      setImageShow([]);
      setImages([]);
      setCategory("");
      setAddons([{ question: "", options: [] }]);
      setActiveTab("product");
      navigate("/seller/dashboard/products"); // Redirect to products page
    }
  }, [successMessage, errorMessage]);

  return (
    <div className="px-2 lg:px-7 pt-5 ">
      <div className="w-full p-4  bg-[#ffffff] rounded-md">
        <div className="flex justify-between items-center pb-4">
          <h1 className="text-[#000000] text-xl font-semibold">Add Product</h1>
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
          <form onSubmit={add}>
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
                      required
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
                      className={`absolute top-[101%] bg-blue-600 w-full transition-all ${
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
                      <div className="flex justify-start items-start flex-col h-[200px] overflow-x-scroll">
                        {allCategory.map((c, i) => (
                          <span
                            key={i}
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
                      min="0"
                      className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#ffffff] border border-slate-700 rounded-md text-[#000000]"
                      onChange={inputHandle}
                      value={state.discount}
                      type="number"
                      placeholder="%discount%"
                      name="discount"
                      id="discount"
                    />
                  </div>
                </div>
                <div className="flex flex-col w-full gap-1 text-[#000000] mb-5">
                  <label htmlFor="description">Description</label>
                  <textarea
                    rows={4}
                    className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#ffffff] border border-slate-700 rounded-md text-[#000000]"
                    onChange={inputHandle}
                    value={state.description}
                    placeholder="Description"
                    name="description"
                    id="description"
                  ></textarea>
                </div>
              </div>
            )}
            {activeTab === "addons" && (
              <AddonsSection
                addons={addons}
                setAddons={setAddons}
                errors={errors}
              />
            )}
            {activeTab === "images" && (
              <div className="grid lg:grid-cols-4 grid-cols-1 md:grid-cols-3 sm:grid-cols-2 sm:gap-4 md:gap-4 xs:gap-4 gap-3 w-full text-[#000000] mb-4">
                {imageShow.map((img, i) => (
                  <div key={i} className="h-[180px] relative">
                    <label htmlFor={i}>
                      <img
                        className="w-full h-full rounded-sm"
                        src={img.url}
                        alt=""
                      />
                    </label>
                    <input
                      onChange={(e) => changeImage(e.target.files[0], i)}
                      type="file"
                      id={i}
                      className="hidden"
                    />
                    <span
                      onClick={() => removeImage(i)}
                      className="p-2 z-10 cursor-pointer bg-slate-700 hover:shadow-lg hover:shadow-slate-400/50 text-white absolute top-1 right-1 rounded-full"
                    >
                      <IoCloseSharp />
                    </span>
                  </div>
                ))}
                <label
                  className="flex justify-center items-center flex-col h-[180px] cursor-pointer border border-dashed hover:border-indigo-500 w-full text-[#000000]"
                  htmlFor="image"
                >
                  <span>
                    <BsImages />
                  </span>
                  <span>select image</span>
                </label>
                <input
                  multiple
                  onChange={inmageHandle}
                  className="hidden"
                  type="file"
                  id="image"
                />
                {errors.images && (
                  <span className="text-red-500">{errors.images}</span>
                )}
              </div>
            )}
            {activeTab === "bulkPricing" && (
              <BulkUploadSection
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
                  "Add product"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
