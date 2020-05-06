const ROUTE_POINTS_COUNT = 10;

import RouteInfoComponent from "./components/route-info.js";
import RouteCostComponent from "./components/route-cost.js";
import MenuComponent from "./components/menu.js";
import FilterController from "./controllers/filter.js";
import {RenderPosition, render} from "./utils/render.js";
import {generateRoutePoints} from "./mock/route-point.js";
import TripController from "./controllers/trip.js";
import RoutePointsModel from "./models/points.js";

const routePoints = generateRoutePoints(ROUTE_POINTS_COUNT).sort((a, b) => a.eventStartDate - b.eventStartDate);

const routePointsModel = new RoutePointsModel();
routePointsModel.setRoutePoints(routePoints);

const tripMainElement = document.querySelector(`.trip-main`);
render(tripMainElement, new RouteInfoComponent(routePoints), RenderPosition.AFTERBEGIN);

const tripInfo = tripMainElement.querySelector(`.trip-info__main`);
render(tripInfo, new RouteCostComponent(routePoints), RenderPosition.AFTEREND);

const tripControls = tripMainElement.querySelector(`.trip-controls`);
const tripMenu = tripControls.querySelector(`h2`);
render(tripMenu, new MenuComponent(), RenderPosition.AFTEREND);

const filterController = new FilterController(tripControls, routePointsModel);
filterController.render();

const tripEvents = document.querySelector(`.trip-events`);

const tripController = new TripController(tripEvents, routePointsModel);
tripController.render(routePoints);
