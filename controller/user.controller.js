const User = require("../models/user.model");
const md5 = require("md5");
const { StatusCodes } = require("http-status-codes");
const { updateSearchIndex } = require("../models/note.model");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    let { name, surname, password, email, currentClass } = req.body;
    console.log(req.body)
    const userkontrol = await User.findOne({ email });
    if (userkontrol) {
      res.status(400).json({ message: "Bu e-posta adresi zaten kayıtlı" });
    }
    let _password = md5(password);
    const user = new User({
      name,
      surname,
      password: _password,
      email,
      currentClass,
    });

    const json = await user.save();
    res.json({ user: user._id, data: json, message: "Kayıt başarılı" })
      .status(StatusCodes.CREATED);
  } catch (error) {
    res.status(500).json({ message: "Kullanıcı kaydı başarısız" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  try {
    const _password = md5(password)
    const json = await User.findOne({
      email: email,
      password: _password,
    });
    // const token=createToken(json._id)
    // res.cookie("jwt", token,{
    //   httpOnly:true,
    //   secure:true,
    //   maxAge:1000*60*60*24
    // })

    if (!json) {
      throw new Error("Kullanıcı bulunamadı")
    }
    res.json({ data: json })
  } catch (error) {
    res.json({ data: null, message: error.message }).status(400)
  }
};

//kullanıcı id sine göre token oluşturalım.
// exports.createToken = (userId) => {
//   return jwt.sign({userId}, process.env.JWT_SECRET, {
//     expiresIn: "1d",
//   });
// }


exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json({ data: users }).status(StatusCodes.OK);
  } catch (error) {
    res.json({ message: "Kullanıcılar getirilemedi" }).status(500);
  }
};

exports.ChangePassword = async (req, res) => {
  try {
    const { id, password } = req.body;
    const _password = md5(password);
    const user = await User.findByIdAndUpdate(id, { password: _password });
    res.json({ data: user }).status(StatusCodes.OK);
  }
  catch (error) {
    res.json({ message: "Şifre güncellenemedi" }).status(StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

exports.getDashbord = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const notes = await Notes.find({ id: id });
    res.json({ data: user, notes }).status(StatusCodes.OK);
  } catch (error) {
    res.json({ message: "Kullanıcı getirilemedi" }).status(StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

exports.updateUser = async (req, res) => {
  try {
    const { id, name, surname, email, currentClass } = req.body;
    const user = await User.findByIdAndUpdate(id, { name, surname, email, currentClass });
    res.json({ data: user }).status(StatusCodes.OK);
  }
  catch (error) {
    res.json({ message: "Kullanıcı güncellenemedi" }).status(StatusCodes.INTERNAL_SERVER_ERROR);
  }
}









