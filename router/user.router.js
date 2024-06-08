const express = require("express")
const router = express.Router()
const userController = require("../controller/user.controller")
const authMiddleware = require("../middlewares/authMiddleware")




router.post("/register", userController.register)
router.post("/login", userController.login)

router.get("/getAllUsers", userController.getAllUsers)
router.post("/ChangePassword", userController.ChangePassword)
router.post("/updateUser", userController.updateUser)





module.exports = {
    user: router
}