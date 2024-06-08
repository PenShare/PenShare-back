const express = require("express")
const router = express.Router()
const noteController = require("../controller/note.controller")

router.post("/createNote", noteController.createNote)
router.get("/getAllNotes", noteController.getAllNotes)
router.get("/getNoteById/:id", noteController.getNoteById)

router.delete("/deleteNoteById:id", noteController.deleteNoteById)
router.get("/getNotesByClass", noteController.getNotesByClass)
router.get("/getNotesByLesson", noteController.getNotesByLesson)
router.get("/MyNotes", noteController.MyNotes)
// router.get("/downloadNote", noteController.downloadNote)




module.exports = {
    note: router
}