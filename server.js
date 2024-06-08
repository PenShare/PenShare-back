const express = require("express");
const cors=require("cors")
const dbConnect = require("./db/connect");
const serverConfig = require("./config/server.config").serverConfig;
const userRouter = require("./router/user.router").user;
const noteRouter = require("./router/note.router").note;
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const cookieParser = require("cookie-parser");
const { checkUser } = require("./middlewares/authMiddleware");
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cookieParser());

cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET
})

const corsOrigin = {
  origin: 'http://localhost:3000', //or whatever port your frontend is using
  credentials: true,
  optionSuccessStatus: 200
}
app.use(cors(corsOrigin));
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp/",
}));

serverConfig();
const PORT = 5000 || process.env.PORT;


app.use('*',checkUser);
app.use("/user", userRouter);
app.use("/note", noteRouter);

dbConnect
  .mongooseConnection()
  .then(() => {
    console.log("DB bağlantısı başarılı");
    app.listen(PORT, () => {
      console.log("Server", PORT, "portunda çalışıyor");
    });
  })
  .catch((error) => {
    console.log("DB bağlantı hatası", error.message);
  });
