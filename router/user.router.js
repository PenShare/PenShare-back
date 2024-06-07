const express = require("express")
const router = express.Router()
const userController = require("../controller/user.controller")
const authMiddleware = require("../middlewares/authMiddleware")

//authentication middleware eklencek ama bizde kullanıcıya özgü dashbord var 
// not görüntüleme gibi işlemlerde olmalı mı ?


router.post("/register", userController.register)
router.post("/login", userController.login)

router.get("/getAllUsers", userController.getAllUsers)
router.post("/ChangePassword", userController.ChangePassword)


module.exports = {
    user: router
}