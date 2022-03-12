const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Picture = require("../models/Picture");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "image/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname.split(".")[0] + path.extname(file.originalname));
  },
});

router.post("/", (req, res) => {
  if (!fs.existsSync(path.resolve(__dirname + "image/"))) {
    fs.mkdirSync("image/", { recursive: true }, (err) => {
      if (err) {
        console.log(err.message);
      }
    });
  }

  const upload = multer({ storage: storage }).array("files", 30);

  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.log(err);
    } else if (err) {
      console.log(err);
    }

    req.files.forEach(async (elem) => {
      const newPicture = await new Picture({
        name: elem.originalname,
        type: elem.mimetype,
        size: elem.encoding,
      });
      newPicture.save();
    });
    res.status(200).json(req.files.length);
  });
});

router.get("/", async (req, res) => {
  const pictures = await Picture.find();
  res.status(200).json(pictures);
});

module.exports = router;
