const express = require("express");
const router = express.Router();
const controller = require("../controllers/transaction.controller");
const authGuard = require("../middlewares/auth.middleware");

router.post("/send",authGuard, controller.sendTransaction);

module.exports = router;
