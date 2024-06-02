const User = require("../models/user.model");
const md5 = require("md5");
const { StatusCodes } = require("http-status-codes");


exports.register = async (req, res) => {
  try {
    let { name, surname, password, email,currentClass } = req.body;
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
    res
      .json({ data: json, message: "Kayıt başarılı" })
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
    if (!json) {
      throw new Error("Kullanıcı bulunamadı")
    } 
    res.json({data: json})
  } catch (error) {
    res.json({data: null, message: error.message}).status(400)
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json({ data: users }).status(StatusCodes.OK);
  } catch (error) {
    res.json({ message: "Kullanıcılar getirilemedi" }).status(500);
  }
};



