// **импорт
const pattern = require("express").Router();

// **функционал
pattern.get("*", (req, res) => {
  return res.status(404).send({ message: "Запрашиваемый ресурс не найден" });
});

// **экспорт
module.exports = pattern;
