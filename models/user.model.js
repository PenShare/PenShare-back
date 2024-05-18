import mongoose from "mongoose";
import bcrypt from "bcrypt";
const { Schema } = mongoose;
import validator from "validator";


const userSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: [true, "Kullanıcı ismi boş bırakılamaz."],
      lowercase: true,
      //validate: [validator.isAlphanumeric, "Kullanıcı ismi sadece harf ve rakam içerebilir."],
    },
    surname:{
      type: Schema.Types.String,
      required: [true, "Kullanıcı soyadı boş bırakılamaz."],
      lowercase: true,
      //validate: [validator.isAlphanumeric, "Kullanıcı ismi sadece harf ve rakam içerebilir."],
    },
    email: {
      type: Schema.Types.String,
      required: [true, "E-mail adresi boş bırakılamaz."],
      unique: true,
      validate: [validator.isEmail, "Geçerli bir e-mail adresi giriniz."],
    },
    password: {
      type: Schema.Types.String,
      required: [true, "Şifre boş bırakılamaz."],
      minLength: [6, "Şifre en az 6 karakter olmalıdır."],
    },
    sınıf:{
       type:Schema.Types.String,
       required: [true, "Sınıf boş bırakılamaz."],
    },
  },
  {
    minimize: true,
    timestamps: true,
    autoIndex: true
  }
);

userSchema.pre("save", function(next) {
 const user=this
 bcrypt.hash(user.password, 10,(err,hash) => {
  user.password = hash
  next();
})
})
const User = mongoose.model("User", userSchema,"user")

export default User;