// **импорты
const router = require("express").Router();
const randomWords = require("random-words");

// **константы
const DATE_OPTIONS = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
};

// **функционал
const randomDate = () => {
  return new Date(Date.now() - Math.random() * 100000000000);
};

function createDataBase() {
  const dataArray = [];
  const wordsArray = [];
  const getRandomWord = () => {
    const word = randomWords();

    if (!wordsArray.includes(word)) {
      wordsArray.push(word);
      return word;
    } else {
      return getRandomWord();
    }
  };

  for (let i = 0; i < 50; i++) {
    const dataObject = {};
    dataObject.date = new Intl.DateTimeFormat("en-US", DATE_OPTIONS).format(
      randomDate()
    );
    const word = getRandomWord();
    dataObject.name = word;
    dataObject.quantity = Math.ceil(Math.random() * 10);
    dataObject.distance = Math.ceil(Math.random() * 1000);
    dataArray.push(dataObject);
  }

  return dataArray;
}

function sendData(req, res) {
  const data = createDataBase();
  res.status(200).send({ data });
}

router.get("/", sendData);

// **экспорт
module.exports = router;
