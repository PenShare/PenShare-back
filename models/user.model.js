const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: [true, "Kullanıcı ismi boş bırakılamaz."],
    },
    surname: {
      type: Schema.Types.String,
      required: false,
    },
    email: {
      type: Schema.Types.String,
      required:  [true, "E-mail adresi boş bırakılamaz."],
      unique: true,
     // validate: [validator.isEmail, "Geçerli bir e-mail adresi giriniz."],
    },
    password: {
      type: Schema.Types.String,
      required: [true, "Şifre boş bırakılamaz."],
      min: [4, "Şifre en az 4 karakter olmalıdır."],
    },
    notes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Note",
      },
    ],
  },
  {
    minimize: true,
    timestamps: true,
    autoIndex: true,
  }
);

//eyüphan 
userSchema.pre("save", function(next) {
  const user=this
  bcrypt.hash(user.password, 10,(err,hash) => {
   user.password = hash
   next();
 })
 })



const User = mongoose.model("User", userSchema, "user");

module.exports = User;
