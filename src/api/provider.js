import Offer from "../models/offer.js";
import Destination from "../models/destination.js";
import RoutePoint from "../models/point.js";
import {nanoid} from "nanoid";

const isOnline = () => {
  return window.navigator.onLine;
};

export default class Provider {
  constructor(api, offersStore, destinationStore, routePointsStore) {
    this._api = api;
    this._offersStore = offersStore;
    this._destinationStore = destinationStore;
    this._routePointsStore = routePointsStore;
  }

  getOffers() {
    if (isOnline()) {
      return this._api.getOffers()
      .then((offers) => {
        offers.forEach((offer, index) => this._offersStore.setItem(index, offer));

        return offers;
      });
    }

    const storeOffers = Object.values(this._offersStore.getItems());

    return Promise.resolve(Offer.parseOffers(storeOffers));
  }

  getDestinations() {
    if (isOnline()) {
      return this._api.getDestinations()
      .then((destinations) => {
        destinations.forEach((destination, index) => this._destinationStore.setItem(index, destination));

        return destinations;
      });
    }

    const storeDestinations = Object.values(this._destinationStore.getItems());

    return Promise.resolve(Destination.parseDestinations(storeDestinations));
  }

  getRoutePoints() {
    if (isOnline()) {
      return this._api.getRoutePoints()
      .then((routePoints) => {
        const items = routePoints.reduce((acc, current) => {
          return Object.assign({}, acc, {
            [current.id]: current,
          });
        }, {});

        this._routePointsStore.setItems(items);
        return routePoints;
      });
    }

    const storeRoutePoints = Object.values(this._routePointsStore.getItems());

    return Promise.resolve(RoutePoint.parsePoints(storeRoutePoints));
  }

  createRoutePoint(routePoint) {
    if (isOnline()) {
      return this._api.createRoutePoint(routePoint)
      .then((newRoutePoint) => {
        this._routePointsStore.setItem(newRoutePoint.id, newRoutePoint);

        return newRoutePoint;
      });
    }

    const localNewRoutePointId = nanoid();
    const localNewRoutePoint = RoutePoint.clone(Object.assign(routePoint, {id: localNewRoutePointId}));

    this._routePointsStore.setItem(localNewRoutePoint.id, localNewRoutePoint);

    return Promise.resolve(localNewRoutePoint);
  }

  updateRoutePoint(id, routePoint) {
    if (isOnline()) {
      return this._api.updateRoutePoint(id, routePoint)
      .then((newRoutePoint) => {
        this._routePointsStore.setItem(newRoutePoint.id, newRoutePoint);

        return newRoutePoint;
      });
    }

    const localRoutePoint = RoutePoint.clone(Object.assign(routePoint, {id}));

    this._routePointsStore.setItem(id, localRoutePoint);

    return Promise.resolve(localRoutePoint);
  }

  deleteRoutePoint(id) {
    if (isOnline()) {
      return this._api.deleteRoutePoint(id)
      .then(() => this._routePointsStore.removeItem(id));
    }

    this._routePointsStore.removeItem(id);

    return Promise.resolve();
  }
}
