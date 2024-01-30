import express from "express"
import UserController from "../controller/user.js"
import Auth from "../helper/auth.js"
const router =express.Router()

router.get("/",Auth.authenticate,UserController.getAllUsers)
router.get("/:id",UserController.getUserById)
router.post("/createUser",UserController.createUser)
router.post("/login",UserController.login)

export default router