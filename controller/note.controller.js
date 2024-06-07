const Note = require("../models/note.model.js");
const User = require("../models/user.model.js");
const { StatusCodes } = require("http-status-codes");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");


exports.createNote = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(
      req.files.note.tempFilePath,//not ekleme ekranında dosya ismine göre değiştirilmeli 
      {use_filename:true,
      folder:"PenShare"}
    )
    const {author,ders,url,image_id,} = req.body;
    const note = new Note({
      author:res.locals.user._id,
      url: result.secure_url,// 
      image_id: result.public_id,//
      ders,
    });
    const json = await note.save();
    const user = await User.findOne({ email: author });
    user.notes.push(json._id);
    await user.save();
    res
      .json({ data: json, message: "Not yayınlama işlemi başarılı" })
      .status(StatusCodes.CREATED);
      fs.unlinkSync(req.files.image.tempFilePath);// dosya ismi önemli 
  } catch (error) {
    res
      .json({ message: "Not yayınlama işlemi başarısız" })
      .status(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

exports.getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find();//indirme sayısını populate etmek gerekecek 
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
    const note = await Note.findById(id);//indirme sayısını populate etmek gerekecek 
    res.json({ data: note }).status(StatusCodes.OK);
  } catch (error) {
    res
      .json({ message: "Not getirilemedi" })
      .status(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

 
exports.deleteNote = async (req, res) => {//
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

exports.notsil = async (req, res) => {//
  try {
    const not = await Note.findById(req.params.id);
    const notId = not.image_id
    await cloudinary.uploader.destroy(notId);
    await Note.findOneAndRemove(req.params.id);
    res.json({ message: "Not silme işlemi başarılı" }).status(StatusCodes.OK);
  } catch (error) {
    res
      .json({ message: "Not silme işlemi başarısız" })
      .status(StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

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

exports.deleteNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findByIdAndDelete(id);
    const photo_id = Note.photo_id;
    await cloudinary.uploader.destroy(photo_id);
    await Note.findByIdAndDelete(id);
    res.json({ message: "Not silme işlemi başarılı" }).status(StatusCodes.OK);
  } catch (error) {
    res
      .json({ message: "Not silme işlemi başarısız" })
      .status(StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

exports.getNotesByClass = async (req, res) => {
  try {
    const { sınıf } = req.params;
    const notes = await Note.find({ sınıf });
    res.json({ data: notes }).status(StatusCodes.OK);
  } catch (error) {
    res
      .json({ message: "Notlar getirilemedi" })
      .status(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

exports.getNotesByLesson = async (req, res) => {
  try {
    const { ders } = req.params;
    const notes = await Note.find({ ders });
    res.json({ data: notes }).status(StatusCodes.OK);
  } catch (error) {
    res
      .json({ message: "Notlar getirilemedi" })
      .status(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

exports.MyNotes = async (req, res) => {
  try {
    const notes = await Note.find({ author: res.locals.user._id });
    res.json({ data: notes }).status(StatusCodes.OK);
  } catch (error) {
    res
      .json({ message: "Notlar getirilemedi" })
      .status(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

exports.NoteDownload = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);
    note.görüntülenme += 1;
    await note.save();
    res.json({ data: note }).status(StatusCodes.OK);
  } catch (error) {
    res
      .json({ message: "Not indirilemedi" })
      .status(StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

