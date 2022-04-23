const express = require("express");
const router = express.Router();

const {
  addService,
  editService,
  getUserService,
  // getService,
  deleteService,
} = require("../controllers/service");

router.post("/add", addService);
router.patch("/edit", editService);
router.get("/userservice", getUserService);
//router.get("/location/:state&:city", getService);
router.delete("/delete", deleteService);

module.exports = router;
