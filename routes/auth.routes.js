const express = require("express");
const router = express.Router();
const controller = require("../controllers/auth.controller");
const authGuard = require("../middlewares/auth.middleware");
router.post("/login", controller.login);
router.post("/register", controller.register);
router.get("/me", authGuard,controller.getMe);  
router.get("/balance", authGuard,controller.getBalance);     
module.exports = router;
