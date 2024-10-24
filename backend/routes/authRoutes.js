const router = require("express").Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const authControllers = require("../controllers/authControllers");
router.post("/admin-login", authControllers.admin_login);
router.get("/get-user", authMiddleware, authControllers.getUser);
router.post("/seller-register", authControllers.seller_register);
router.post("/seller-login", authControllers.seller_login);
router.post(
  "/profile-image-upload",
  authMiddleware,
  authControllers.profile_image_upload
);
router.post(
  "/profile-info-add",
  authMiddleware,
  authControllers.profile_info_add
);
router.get("/countries", authControllers.getAllCountries);
router.get("/currencies", authControllers.getAllCurrencies);

router.get("/logout", authMiddleware, authControllers.logout);
router.put(
  "/update-country-currency",
  authMiddleware,
  authControllers.updateCountryAndCurrency
);
router.put("/update-profile", authMiddleware, authControllers.updateProfile);
router.put("/update-shopInfo", authMiddleware, authControllers.updateShopInfo);

router.get("/get-support-info", authMiddleware, authControllers.getSupportInfo);
router.get(
  "/get-support-info-by-seller/:sellerId",
  authControllers.getSupportInfoBySellerId
);
router.put(
  "/update-support-info",
  authMiddleware,
  authControllers.updateSupportInfo
);
router.post(
  "/support-logo-upload",
  authMiddleware,
  authControllers.support_logo_upload
);
router.get("/search-seller", authControllers.searchSellerByName);
router.get("/search-seller-by-id", authControllers.searchSellerById);

module.exports = router;
