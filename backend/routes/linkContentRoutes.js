const router = require("express").Router();
const linkController = require("../controllers/linkControllers");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/content/:sellerId", authMiddleware, linkController.add_linksContent);
router.get("/content/:sellerId", authMiddleware, linkController.get_linksContent);

module.exports = router;
