const ROUTE_POINTS_COUNT = 2;

import RouteInfoComponent from "./components/route-info.js";
import RouteCostComponent from "./components/route-cost.js";
import MenuComponent from "./components/menu.js";
import FilterComponent from "./components/filter.js";
import {filterNames} from "./mock/filter.js";
import {RenderPosition, render} from "./utils/render.js";
import {generateRoutePoints} from "./mock/route-point.js";
import TripController from "./controllers/trip.js";

const routePoints = generateRoutePoints(ROUTE_POINTS_COUNT).sort((a, b) => a.eventStartDate - b.eventStartDate);

const tripMainElement = document.querySelector(`.trip-main`);
render(tripMainElement, new RouteInfoComponent(routePoints), RenderPosition.AFTERBEGIN);

const tripInfo = tripMainElement.querySelector(`.trip-info__main`);
render(tripInfo, new RouteCostComponent(routePoints), RenderPosition.AFTEREND);

const tripControls = tripMainElement.querySelector(`.trip-controls`);
const tripMenu = tripControls.querySelector(`h2`);
render(tripMenu, new MenuComponent(), RenderPosition.AFTEREND);
render(tripControls, new FilterComponent(filterNames), RenderPosition.BEFOREEND);

const tripEvents = document.querySelector(`.trip-events`);

const tripController = new TripController(tripEvents);
tripController.render(routePoints);
