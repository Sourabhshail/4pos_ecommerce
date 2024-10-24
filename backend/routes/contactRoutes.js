const router = require("express").Router();
const contactController = require("../controllers/contactController");
router.post("/save-contact", contactController.saveContact);
router.get("/get-contacts/:sellerId", contactController.getContacts);
module.exports = router;