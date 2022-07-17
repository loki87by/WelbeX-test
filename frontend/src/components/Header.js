// **импорты
import React from "react";
import api from "../utils/Api";
import { debounce } from "../utils/debounce.js";

// **функционал
function Header(props) {
  const [value, setValue] = React.useState("none");
  const [condition, setCondition] = React.useState("includes");
  const [inputValue, setInputValue] = React.useState("");
  const [isFilterChanged, setFilterChanged] = React.useState(false);

  // *фильтруем данные
  React.useEffect(() => {
    const filterData = {
      value,
      condition,
      keyword: inputValue || "none",
    };
    props.setFilterData(filterData);

    if (isFilterChanged) {
      api
        .getMore(filterData)
        .then((res) => {
          const updDB = res.data;

          if (res.data.length < 50) {
            props.setLastData(true);
          } else {
            props.setLastData(false);
          }
          props.setDB(updDB);

          if (res.message) {
            props.setAlert(res.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    setFilterChanged(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFilterChanged]);

  // *отслеживаем селект поля
  function valueHandler(e) {
    setValue(e.target.value);
    setFilterChanged(true);
  }

  // *отслеживаем введенный текст
  function inputHandler(e) {
    setInputValue(e.target.value);
    debounce(setFilterChanged, 1000, true);
  }

  // *отслеживаем селект значения
  function conditionHandler(e) {
    setCondition(e.target.value);
    setFilterChanged(true);
  }

  // **DOM
  return (
    <header>
      <select onChange={valueHandler} defaultValue="none">
        <option value="none">Выберите поле</option>
        <option value="name">Название</option>
        <option value="quantity">Количество</option>
        <option value="distance">Расстояние</option>
      </select>
      <select onInput={conditionHandler} defaultValue="includes">
        <option value="includes">Содержит</option>
        <option value="equals">Равно</option>
        <option value="larger">Больше</option>
        <option value="less">Меньше</option>
      </select>
      <input
        type="text"
        value={inputValue}
        onChange={inputHandler}
        placeholder="Введите искомый текст"
      />
    </header>
  );
}

export default Header;
