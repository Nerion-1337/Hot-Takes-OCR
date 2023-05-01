const router = require("express").Router();
const authController = require("./controllers/auth");
const saucesController = require("./controllers/sauces");
const jwt = require("./middleware/auth");
const multer = require("./middleware/multer")


router.post("/auth/signup", authController.signUp);
router.post("/auth/login", authController.login);

router.get("/sauces", jwt, saucesController.allSauce);
router.get("/sauces/:id", jwt, saucesController.selectSauce);
router.post("/sauces", jwt, multer, saucesController.addSauce);
router.put("/sauces/:id", jwt, multer, saucesController.putSauce);
router.delete("/sauces/:id", jwt, saucesController.deleteSauce);
router.post("/sauces/:id/like", jwt, saucesController.like);

module.exports = router;