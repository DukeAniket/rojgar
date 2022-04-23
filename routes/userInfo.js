const express = require("express");
const router = express.Router();

const { getInfo, createInfo } = require("../controllers/userInfo");
const { uploadImg } = require("../controllers/uploadImg");

router.route("/").post(createInfo);
router.route("/:id").get(getInfo);
router.route("/upload").post(uploadImg);

module.exports = router;
