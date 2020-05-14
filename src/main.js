const ROUTE_POINTS_COUNT = 10;

import RouteInfoComponent from "./components/route-info.js";
import RouteCostComponent from "./components/route-cost.js";
import MenuComponent from "./components/menu.js";
import NewPointComponent from "./components/new-point.js";
import {MenuElement} from "./const.js";
import FilterController from "./controllers/filter.js";
import {RenderPosition, render} from "./utils/render.js";
import {generateRoutePoints} from "./mock/route-point.js";
import TripController from "./controllers/trip.js";
import RoutePointsModel from "./models/points.js";

const routePoints = generateRoutePoints(ROUTE_POINTS_COUNT).sort((a, b) => a.eventStartDate - b.eventStartDate);

const routePointsModel = new RoutePointsModel();
routePointsModel.setRoutePoints(routePoints);

const tripMainElement = document.querySelector(`.trip-main`);
const routeInfo = new RouteInfoComponent();
routeInfo.generate(routePoints);
render(tripMainElement, routeInfo, RenderPosition.AFTERBEGIN);

const tripInfo = tripMainElement.querySelector(`.trip-info__main`);
const routeCoast = new RouteCostComponent();
routeCoast.calculate(routePoints);
render(tripInfo, routeCoast, RenderPosition.AFTEREND);

const tripControls = tripMainElement.querySelector(`.trip-controls`);
const tripMenu = tripControls.querySelector(`h2`);
const mainMenu = new MenuComponent();
mainMenu.setActiveItem(MenuElement.TABLE);
render(tripMenu, mainMenu, RenderPosition.AFTEREND);

mainMenu.setOnClick((menuItem) => {
  switch (menuItem) {
    case MenuElement.TABLE:
      mainMenu.setActiveItem(MenuElement.TABLE);
      break;
    case MenuElement.STATISTICS:
      mainMenu.setActiveItem(MenuElement.STATISTICS);
      break;
  }
});

const filterController = new FilterController(tripControls, routePointsModel);
filterController.render();

const tripEvents = document.querySelector(`.trip-events`);

const tripController = new TripController(tripEvents, routePointsModel, routeCoast, routeInfo, filterController);
tripController.render(routePoints);

const newPoint = new NewPointComponent();
render(tripMainElement, newPoint, RenderPosition.BEFOREEND);

newPoint.setOnClick(() => {
  tripController.createRoutePoint();
});
