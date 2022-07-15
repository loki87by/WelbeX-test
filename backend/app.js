// **импорты
const express = require("express");
const router = require("./router");
const pattern = require("./pattern");

// **константы
const { PORT = 3000 } = process.env;
const app = express();

// **функционал
app.use("/start", router);
app.use("*", pattern);

app.listen(PORT, () => {
  console.log("Server started");
});
