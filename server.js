const express = require("express");
const cors=require("cors")
const dbConnect = require("./db/connect");
const serverConfig = require("./config/server.config").serverConfig;
const userRouter = require("./router/user.router").user;
const noteRouter = require("./router/note.router").note;
const app = express();
app.use(express.json());

const corsOrigin = {
  origin: 'http://localhost:3000', //or whatever port your frontend is using
  credentials: true,
  optionSuccessStatus: 200
}
app.use(cors(corsOrigin));

serverConfig();
const PORT = 5000 || process.env.PORT;

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
