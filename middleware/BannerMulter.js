const multer = require('multer')


try {
    const BannerStorage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, './public/BannerImages/')
      },
      filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
      }
      })
    const storeBanner = multer({ BannerStorage: BannerStorage })
    
    module.exports = storeBanner;
} catch (error) {
    console.log(error,"///////////>>>>//");
}
