const express = require("express");
const router = express.Router();

const {
  addService,
  editService,
  getUserService,
  getUserService,
  getService,
} = require("../controllers/service");

router.post("/add", addService);
router.post("/edit", editService);
router.post("/logout", logout);
router.get("/user-service/:email", getUserService);
router.get("/location/:state&:city", getService);

module.exports = router;
