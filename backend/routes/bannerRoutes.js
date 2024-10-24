const router = require('express').Router()
const bannerController = require('../controllers/bannerController')
const { authMiddleware } = require('../middlewares/authMiddleware')
router.post('/banner/add', authMiddleware, bannerController.add_banner)
router.get('/banner/get/:sellerId', bannerController.get_banner)
router.delete('/banner/delete/:bannerId', authMiddleware, bannerController.delete_banner)
router.get('/banners', bannerController.get_banners)

module.exports = router