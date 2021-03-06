import Offers from "../models/offer.js";
import Destinations from "../models/destination.js";
import RoutePoints from "../models/point.js";

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  throw new Error(`${response.status}: ${response.statusText}`);
};

const API = class {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getOffers() {
    return this._load({url: `offers`})
    .then((response) => response.json())
    .then(Offers.parseOffers);
  }

  getDestinations() {
    return this._load({url: `destinations`})
    .then((response) => response.json())
    .then(Destinations.parseDestinations);
  }

  getRoutePoints() {
    return this._load({url: `points`})
    .then((response) => response.json())
    .then(RoutePoints.parsePoints);
  }

  createRoutePoint(routePoint) {
    return this._load({
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(routePoint.toRAW()),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json())
      .then(RoutePoints.parsePoint);
  }

  updateRoutePoint(id, routePoint) {
    return this._load({
      url: `points/${id}`,
      method: Method.PUT,
      body: JSON.stringify(routePoint.toRAW()),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json())
      .then(RoutePoints.parsePoint);
  }

  deleteRoutePoint(id) {
    return this._load({url: `points/${id}`, method: Method.DELETE});
  }

  sync(routePoints) {
    return this._load({
      url: `points/sync`,
      method: Method.POST,
      body: JSON.stringify(routePoints),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json());
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
};

export default API;
