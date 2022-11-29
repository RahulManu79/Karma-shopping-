const multer = require('multer')
const path = require('path')


try {
    const BannerStorage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, './public/BannerImages/')
      },
      filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
      }
      })
    const storeBanner = multer({ storage: BannerStorage })
    
    module.exports = storeBanner;
} catch (error) {
    console.log(error,"///////////>>>>//");
}
