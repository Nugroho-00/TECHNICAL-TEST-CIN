const router = require("express").Router();
const {
  registerAccount,
  loginAccount,
  getProfileInfo
} = require("../controllers/authControllers");
const { authentication } = require("../middlewares/authentication");

// Register , Login and Profile
router.post("/register", registerAccount);
router.post("/login", loginAccount);
router.get("/me", authentication, getProfileInfo)


module.exports = router;