import {isFutureEvent, isPastEvent} from "./common.js";
import {FilterType} from "../const.js";

export const getEverythingRoutePoints = (routePoints) => {
  return routePoints;
};

export const getFutureRoutePoints = (routePoints) => {
  return routePoints.filter((routePoint) => isFutureEvent(routePoint.eventStartDate));
};

export const getPastRoutePoints = (routePoints) => {
  return routePoints.filter((routePoint) => isPastEvent(routePoint.eventEndDate));
};

export const getRoutePointsByFilter = (routePoints, filterType) => {
  switch (filterType) {
    case FilterType.EVERYTHING:
      return getEverythingRoutePoints(routePoints);
    case FilterType.FUTURE:
      return getFutureRoutePoints(routePoints);
    case FilterType.PAST:
      return getPastRoutePoints(routePoints);
  }

  return routePoints;
};
