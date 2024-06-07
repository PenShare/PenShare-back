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
    currentClass: {
      type: Schema.Types.String,
      required: false,
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

 
userSchema.pre("save", function(next) {
   next();
 })



const User = mongoose.model("User", userSchema, "user");

module.exports = User;
