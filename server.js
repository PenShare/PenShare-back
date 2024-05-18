const express = require("express");
const dbConnect = require("./db/connect");
const serverConfig = require("./config/server.config").serverConfig;
const userRouter = require("./router/user.router").user;
const noteRouter = require("./router/note.router").note;
const app = express();
app.use(express.json());
serverConfig();
const PORT = 3000 || process.env.PORT;

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
