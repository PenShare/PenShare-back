const Note = require("../models/note.model.js");
const User = require("../models/user.model.js");
const { StatusCodes } = require("http-status-codes");

exports.createNote = async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const note = new Note({
      title,
      content,
      author,
    });
    const json = await note.save();
    const user = await User.findOne({ email: author });
    user.notes.push(json._id);
    await user.save();
    res
      .json({ data: json, message: "Not yayınlama işlemi başarılı" })
      .status(StatusCodes.CREATED);
  } catch (error) {
    res
      .json({ message: "Not yayınlama işlemi başarısız" })
      .status(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

exports.getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find();
    res.json({ data: notes }).status(StatusCodes.OK);
  } catch (error) {
    res
      .json({ message: "Notlar getirilemedi" })
      .status(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

exports.getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);
    res.json({ data: note }).status(StatusCodes.OK);
  } catch (error) {
    res
      .json({ message: "Not getirilemedi" })
      .status(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

// //Notu güncellemek için bir endpoint oluşturduk
// exports.updateNote = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, content, author } = req.body;
//     //Notu güncelledik
//     const note = await Note.findByIdAndUpdate(
//       id,
//       { title, content, author },
//       { new: true }
//     );
//     //Notu güncelledikten sonra kullanıcıya ait notları güncellemek için User modelini kullandık
//     await User.findOneAndUpdate(
//       { email: author },
//       { $push: { notes: note._id } }, //Notu güncelledikten sonra kullanıcıya ait notları güncellemek notes arrayine note._id ekledik
//       { new: true }
//     );
//     res.json({ data: note }).status(200);
//   } catch (error) {
//     res.json({ message: "Not güncellenemedi" }).status(500);
//   }
// };

exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findByIdAndDelete(id);
    const user = await User.findOne({ email: note.author });
    user.notes = user.notes.filter((noteId) => noteId.toString() !== id);
    await user.save();
    res.json({ data: note }).status(StatusCodes.OK);
  } catch (error) {
    res
      .json({ message: "Not silinemedi" })
      .status(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

exports.getNotesByAuthor = async (req, res) => {
  try {
    const { author } = req.params;
    const notes = await Note.find({ author });
    res.json({ data: notes }).status(StatusCodes.OK);
  } catch (error) {
    res
      .json({ message: "Notlar getirilemedi" })
      .status(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};
