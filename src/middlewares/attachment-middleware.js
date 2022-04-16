var multer = require('multer');
const fs = require('fs');

module.exports.image = {
    storage: multer.diskStorage({
        destination: function (req, files, cb) {
            const path = './uploads';
            fs.mkdirSync(path, { recursive: true })
            cb(null, path)
        },
        filename: function (req, files, cb) {
            cb(null, Date.now() + "-" + files.originalname)
            // cb(null, file.originalname + "-" + Date.now() + path.extname(file.originalname))
        }
    }),
    
    allowedImage: function (req, files, cb) {
        // Accept images only
        if (!files.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
            req.fileValidationError = 'Only image files are allowed!';
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
}



