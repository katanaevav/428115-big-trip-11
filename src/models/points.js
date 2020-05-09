import {getRoutePointsByFilter} from "../utils/filter.js";
import {FilterType} from "../const.js";

export default class Points {
  constructor() {
    this._routePoints = [];
    this._activeFilterType = FilterType.ALL;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  getRoutePoints() {
    return getRoutePointsByFilter(this._routePoints, this._activeFilterType);
  }

  getRoutePointsAll() {
    return this._routePoints;
  }

  setRoutePoints(routePoints) {
    this._routePoints = Array.from(routePoints);
    this._callHandlers(this._dataChangeHandlers);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  removeRoutePoint(id) {
    const index = this._routePoints.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._routePoints = [].concat(this._routePoints.slice(0, index), this._routePoints.slice(index + 1));
    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  updateRoutePoint(id, routePoint) {
    const index = this._routePoints.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._routePoints = [].concat(this._routePoints.slice(0, index), routePoint, this._routePoints.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  addRoutePoint(routePoint) {
    this._routePoints = [].concat(routePoint, this._routePoints);
    this._callHandlers(this._dataChangeHandlers);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
