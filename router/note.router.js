const express = require("express")
const router = express.Router()
const noteController = require("../controller/note.controller")

router.post("/createNote", noteController.createNote)
router.get("/getAllNotes", noteController.getAllNotes)
router.get("/getNoteById/:id", noteController.getNoteById)

module.exports = {
    note: router
}