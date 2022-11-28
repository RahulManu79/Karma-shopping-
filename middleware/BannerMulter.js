const multer = require('multer')

const BannerStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/BannerImages/')
    },
    filename: function (req, file, callback) {
        const unique = file.originalname.substr(file.originalname.lastIndexOf('.'))
        callback(null, file.fieldname + '-' + Date.now() + unique)
    }
})
const storeBanner = multer({ BannerStorage: BannerStorage })

module.exports = storeBanner;