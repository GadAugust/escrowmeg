const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const formidable = require("formidable");

const spacesEndpoint = new aws.Endpoint("ams3.digitaloceanspaces.com");
const s3 = new aws.S3({
  endpoint: spacesEndpoint,
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "eskro-bucket/profile_pic",
    acl: "public-read",
    key: function (req, file, cb) {
      // console.log(file);
      cb(null, Date.now() + "-" + file.originalname);
      req.body.img_url = Date.now() + "-" + file.originalname;
    },
  }),
}).array("file", 1);

const uploadImage = (req, res, next) => {
  upload(req, res, function (error) {
    if (error) {
      console.log("Fialed to upload Error >>>>>>>>>>>>>>", error);
      res.status(501).send({ message: "Upload failed" });
      return;
    }
    console.log("File uploaded successfully.");
    console.log(req.body);
    next();
  });
};

module.exports = {
  uploadImage,
};
