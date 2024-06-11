const express = require("express")
const router = express.Router()
const noteController = require("../controller/note.controller")

router.post("/createNote", noteController.createNote)
router.get("/getAllNotes", noteController.getAllNotes)
router.get("/getNoteById/:id", noteController.getNoteById)

router.get("/getNotesByAuthor", noteController.getNotesByAuthor)
router.get("/getNotesByClass", noteController.getNotesByClass)
router.get("/getNotesByLesson", noteController.getNotesByLesson)
router.get("/MyNotes", noteController.MyNotes)
router.get("/NoteDownload", noteController.NoteDownload)
router.delete("/deleteNoteById", noteController.deleteNoteById)
router.post("/OnayNote", noteController.OnayNote)
router.get("/MyFalseNote", noteController.MyFalseNote)





module.exports = {
    note: router
}