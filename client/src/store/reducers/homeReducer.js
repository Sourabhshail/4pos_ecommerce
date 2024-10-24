import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
export const get_category = createAsyncThunk(
  "product/get_category",
  async (_, { fulfillWithValue }) => {
    try {
      const { data } = await api.get("/home/get-categorys");
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response);
    }
  }
);

export const get_products = createAsyncThunk(
  "product/get_products",
  async (sellerId, { fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/home/seller/${sellerId}/products`);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response);
    }
  }
);

export const get_product = createAsyncThunk(
  "product/get_product",
  async ({sellerId,slug}, { fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/home/seller/${sellerId}/product/${slug}`);
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response);
    }
  }
);

export const price_range_product = createAsyncThunk(
  "product/price_range_product",
  async (sellerId, { fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/home/seller/price-range-latest-product/${sellerId}`);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response);
    }
  }
);

export const get_banners = createAsyncThunk(
  "product/get_banners",
  async (sellerId, { fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/banner/get/${sellerId}`);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response);
    }
  }
);

export const query_products = createAsyncThunk(
  "product/query_products",
  async ({sellerId,query}, { fulfillWithValue }) => {
    try {
      const { data } = await api.get(
        `/home/seller/${sellerId}/query-products?category=${query.category}&&rating=${
          query.rating
        }&&lowPrice=${query.low}&&highPrice=${query.high}&&sortPrice=${
          query.sortPrice
        }&&pageNumber=${query.pageNumber}&&searchValue=${
          query.searchValue ? query.searchValue : ""
        }`
      );
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response);
    }
  }
);

export const customer_review = createAsyncThunk(
  "review/customer_review",
  async (info, { fulfillWithValue }) => {
    try {
      const { data } = await api.post("/home/customer/submit-review", info);
      return fulfillWithValue(data);
    } catch (error) {}
  }
);

export const get_reviews = createAsyncThunk(
  "review/get_reviews",
  async ({ productId, pageNumber }, { fulfillWithValue }) => {
    try {
      const { data } = await api.get(
        `/home/customer/get-reviews/${productId}?pageNo=${pageNumber}`
      );
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {}
  }
);

export const homeReducer = createSlice({
  name: "home",
  initialState: {
    categorys: [],
    products: [],
    totalProduct: 0,
    parPage: 4,
    latest_product: [],
    topRated_product: [],
    discount_product: [],
    priceRange: {
      low: 0,
      high: 100,
    },
    product: {},
    relatedProducts: [],
    moreProducts: [],
    successMessage: "",
    errorMessage: "",
    totalReview: 0,
    rating_review: [],
    reviews: [],
    banners: [],
  },
  reducers: {
    messageClear: (state, _) => {
      state.successMessage = "";
      state.errorMessage = "";
    },
  },
  extraReducers: {
    [get_category.fulfilled]: (state, { payload }) => {
      state.categorys = payload.categorys;
    },
    [get_products.fulfilled]: (state, { payload }) => {
      state.products = payload.products;
      state.latest_product = payload.latest_product;
      state.topRated_product = payload.topRated_product;
      state.discount_product = payload.discount_product;
    },
    [get_product.fulfilled]: (state, { payload }) => {
      state.product = payload.product;
      state.relatedProducts = payload.relatedProducts;
      state.moreProducts = payload.moreProducts;
    },
    [price_range_product.fulfilled]: (state, { payload }) => {
      state.latest_product = payload.latest_product;
      state.priceRange = payload.priceRange;
    },
    [query_products.fulfilled]: (state, { payload }) => {
      state.products = payload.products;
      state.totalProduct = payload.totalProduct;
      state.parPage = payload.parPage;
    },
    [customer_review.fulfilled]: (state, { payload }) => {
      state.successMessage = payload.message;
    },
    [get_reviews.fulfilled]: (state, { payload }) => {
      state.reviews = payload.reviews;
      state.totalReview = payload.totalReview;
      state.rating_review = payload.rating_review;
    },
    [get_banners.fulfilled]: (state, { payload }) => {
      state.banners = payload.banner;
    },
  },
});
export const { messageClear } = homeReducer.actions;
export default homeReducer.reducer;