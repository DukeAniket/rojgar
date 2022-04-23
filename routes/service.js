const express = require("express");
const router = express.Router();

const {
  addService,
  editService,
  getUserService,
  getService,
  deleteService,
} = require("../controllers/service");

router.post("/add", addService);
router.patch("/edit", editService);
router.get("/user", getUserService);
router.get("/location", getService);
router.delete("/delete", deleteService);

module.exports = router;
