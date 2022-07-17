// **импорты
const router = require("express").Router();
const randomWords = require("random-words");

const DATE_OPTIONS = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
};

const db = [];
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

const randomDate = () => {
  return new Date(Date.now() - Math.random() * 100000000000);
};

function createDataBase() {
  for (let i = 0; i < 50; i++) {
    const dataObject = {};
    dataObject.date = new Intl.DateTimeFormat("en-US", DATE_OPTIONS).format(
      randomDate()
    );
    const word = getRandomWord();
    dataObject.name = word;
    dataObject.quantity = Math.ceil(Math.random() * 10);
    dataObject.distance = Math.ceil(Math.random() * 1000);
    db.push(dataObject);
  }
}

function updateDB() {
  for (let i = 0; i < 20; i++) {
    createDataBase();
  }
  db.push({})
}

const firstArrayPart = () => {
  const current = [];
  for (let i = 0; i < 50; i++) {
    current.push(db[i]);
  }
  return current;
};

function sendData(req, res) {
  let dbCreated = true;

  if (db.length === 0) {
    createDataBase();
    dbCreated = false;
    res.status(200).send({ data: db });
    updateDB();
  }

  if (dbCreated) {
    const current = firstArrayPart();
    res.status(200).send({ data: current });
  }
}

const queryChecker = (value, condition, keyword) => {
  if (db.length === 0) {
    createDataBase();
    updateDB();
  }

  if (condition === "includes") {
    if (value !== "none") {
      return db.filter((item) =>
        item[value].toString().includes(keyword.toString())
      );
    } else {
      return db;
    }
  } else if (condition === "equals") {
    if (value !== "none") {
      return db.filter((item) => item[value].toString() === keyword.toString());
    } else {
      return db;
    }
  } else {
    if (+keyword !== NaN) {
      if (condition === "larger") {
        return db
          .filter((item) => item[value] > keyword)
          .sort((a, b) => {
            if (a[value] < b[value]) {
              return -1;
            }

            if (a[value] > b[value]) {
              return 1;
            }
            return 0;
          });
      }

      if (condition === "less") {
        return db
          .filter((item) => item[value] < keyword)
          .sort((a, b) => {
            if (a[value] > b[value]) {
              return -1;
            }

            if (a[value] < b[value]) {
              return 1;
            }
            return 0;
          });
      }
    }

    if (condition === "larger") {
      return db
        .filter((item) => item[value] > +keyword)
        .sort((a, b) => {
          return a[value] - b[value];
        });
    }

    if (condition === "less") {
      return db
        .filter((item) => item[value] < +keyword)
        .sort((a, b) => {
          return b[value] - a[value];
        });
    }
  }
};

function sendMoreData(req, res) {
  const { value, condition, keyword, page } = req.query;
  const currentDB = queryChecker(value, condition, keyword);
  const currentArray = [];
  let start = 1;

  if (page) {
    start = +page;
  }

  for (let i = (start - 1) * 50; i < start * 50; i++) {
    currentArray.push(currentDB[i]);
  }
  const filtered = currentArray.filter((item) => {
    if (item) {
      return item;
    }
  });

  if (filtered.length > 0) {
    res.status(200).send({ data: filtered });
  } else {
    const current = firstArrayPart();
    res.status(200).send({
      data: current,
      message: "По вашему запросу совпадений не найдено",
    });
  }
}

router.get("/start", sendData);
router.get("/more", sendMoreData);

// **экспорт
module.exports = router;
