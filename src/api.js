import Offers from "./models/offer.js";
import Destinations from "./models/destination.js";
import RoutePoints from "./models/point.js";

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const API = class {
  constructor(authorization) {
    this._authorization = authorization;
  }

  getOffers() {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(`https://11.ecmascript.pages.academy/big-trip/offers`, {headers})
    .then(checkStatus)
    .then((response) => response.json())
    .then(Offers.parseOffers);
  }

  getDestinations() {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(`https://11.ecmascript.pages.academy/big-trip/destinations`, {headers})
    .then(checkStatus)
    .then((response) => response.json())
    .then(Destinations.parseDestinations);
  }

  getRoutePoints() {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(`https://11.ecmascript.pages.academy/big-trip/points`, {headers})
    .then(checkStatus)
    .then((response) => response.json())
    .then(RoutePoints.parsePoints);
  }

  updateRoutePoint(id, data) {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(`https://11.ecmascript.pages.academy/big-trip/points/:${id}`, {
      method: `PUT`,
      body: JSON.stringify(data.toRAW()),
      headers,
    })
    .then(checkStatus)
    .then((response) => response.json())
    .then(RoutePoints.parsePoint);
  }
};

export default API;
