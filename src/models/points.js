export default class Points {
  constructor() {
    this._routePoints = [];

    this._dataChangeHandlers = [];
  }

  getRoutePoints() {
    return this._routePoints;
  }

  setRoutePoints(routePoints) {
    this._routePoints = Array.from(routePoints);
    this._callHandlers(this._dataChangeHandlers);
  }

  updateroutePoint(id, routePoint) {
    const index = this._routePoints.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._routePoints = [].concat(this._routePoints.slice(0, index), routePoint, this._routePoints.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
