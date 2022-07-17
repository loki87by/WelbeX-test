export class Api {
  constructor(options) {
    this.url = options.baseUrl;
  }

  // **получение стартовой базы данных
  getData() {
    return fetch(`${this.url}/start`, {
      method: "GET",
    }).then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        return Promise.reject(new Error(`Ошибка: ${res.status}`));
      }
    });
  }

  // **получение новых данных
  getMore(query, page) {
    const { value, condition, keyword } = query;
    let uri = `${this.url}/more?value=${value}&condition=${condition}&keyword=${keyword}`;

    if (page) {
      uri += `&page=${page}`;
    }
    return fetch(uri, {
      method: "GET",
    }).then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        return Promise.reject(new Error(`Ошибка: ${res.status}`));
      }
    });
  }
}

const api = new Api({
  baseUrl: "http://localhost:8080",
});

export default api;
