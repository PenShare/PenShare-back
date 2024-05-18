const User = require("../models/user.model");
const md5 = require("md5");
const { StatusCodes } = require("http-status-codes");


exports.register = async (req, res) => {
  try {
    let { name, surname, password, email } = req.body;
    const userkontrol= await User.findOne({email});
    if(userkontrol){
      res.status(400).json({message: "Bu e-posta adresi zaten kayıtlı"});
    }
    let _password = md5(password);
    const user = new User({
      name,
      surname,
      password: _password,
      email,
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
  try {
    const _password = utils.helper.hashToPassword(password);
    const json = await User.findOne({
      email: email,
      password: _password,
    });
    
    if (!json) {
      throw new Error("Kullanıcı bulunamadı.");
    } else {
      const passwordMatch = await bcrypt.compare(password, json.password);
      if (!passwordMatch) {
        throw new Error("Yanlış şifre girildi.");
      } else {
      return json;
    }
  }
  } catch (error) {
    throw new Error(error);
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



