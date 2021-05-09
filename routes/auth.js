const router = require("express").Router();
const authController = require("../controller/auth");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/refresh_token", authController.generateRefreshToken);
router.delete("/logout/:refreshToken", authController.logout);

module.exports = router;
