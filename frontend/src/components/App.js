/* eslint-disable array-callback-return */
// **импорты
import React from "react";
import Header from "./Header";
import Item from "./Item";
import Footer from "./Footer";
import api from "../utils/Api";

function App() {
  // **стейты
  const [isDataLoaded, setDataLoaded] = React.useState(false);
  const [isShowAlert, setShowAlert] = React.useState(false);
  const [lastData, setLastData] = React.useState(false);
  const [db, setDB] = React.useState([]);
  const [offset, setOffset] = React.useState(0);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [alert, setAlert] = React.useState("");
  const [filterData, setFilterData] = React.useState({
    value: "none",
    condition: "includes",
    keyword: "none",
  });

  // **функционал
  // * получаем дефолтные данные
  React.useEffect(() => {
    if (alert !== "") {
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
        setAlert("");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // *получаем дефолтные данные
  React.useEffect(() => {
    api
      .getData()
      .then((res) => {
        setDB(res.data);

        if (res.data.length < 50) {
          setLastData(true);
        } else {
          setLastData(false);
        }
        setDataLoaded(true);

        if (res.message) {
          setAlert(res.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // *отслеживаем прокрутку страницы
  React.useEffect(() => {
    const onScroll = () => setOffset(window.pageYOffset);
    window.removeEventListener("scroll", onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // *пагинация по скроллу
  React.useEffect(() => {
    const html = document.querySelector("html");

    if (!lastData && offset > html.offsetHeight - html.clientHeight - 1) {
      const nextPage = pageNumber + 1;
      setPageNumber(nextPage);
      api
        .getMore(filterData, pageNumber)
        .then((res) => {
          if (res.data.length < 50) {
            setLastData(true);
          } else {
            setLastData(false);
          }
          const updDB = [...db, ...res.data];
          setDB(updDB);

          if (res.message) {
            setAlert(res.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset]);

  // **DOM
  return (
    <section className="page">
      {isDataLoaded ? (
        <>
          <Header
            filterData={filterData}
            setFilterData={setFilterData}
            setDB={setDB}
            setAlert={setAlert}
            setLastData={setLastData}
          />
          <main>
            <table>
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Название</th>
                  <th>Количество</th>
                  <th>Расстояние</th>
                </tr>
              </thead>
              <tbody>
                {db.map((item, index) => {
                  if (item.date) {
                    return <Item key={index} item={item} />;
                  }
                })}
              </tbody>
            </table>
          </main>
        </>
      ) : (
        <section className="page"><h2>Нет связи с сервером. Убедитесь, что он запущен и обновите страницу</h2></section>
      )}
      {!lastData ? (
        <section className="Preloader">
          <figure className="Preloader__rotator"></figure>
        </section>
      ) : (
        ""
      )}
      <Footer />
      <article className={`${isShowAlert && "showArticle"}`}>
        <h2>{alert}</h2>
      </article>
    </section>
  );
}

// **экспорт
export default App;
