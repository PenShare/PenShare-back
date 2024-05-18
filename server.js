const express = require("express");
const dbConnect = require("./db/connect");
const serverConfig = require("./config/server.config").serverConfig;
const userRouter = require("./router/user.router").user;
const noteRouter = require("./router/note.router").note;
import { checkUser } from './middlewares/authmiddleware.js';
import fileUpload from 'express-fileupload';
import {v2 as cloudinary} from 'cloudinary';
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
  });


const app = express();
app.use(express.json());
serverConfig();
const PORT = 3000 || process.env.PORT;

app.use("/user", userRouter);
app.use("/note", noteRouter);

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles: true
}));

app.use("*",checkUser);//tüm işlemlerde
app.use("/",pageRoute);
app.use("/nots",notRoute);
app.use("/users",userrouter);

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
