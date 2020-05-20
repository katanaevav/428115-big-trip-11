import API from "./api.js";
import RouteInfoComponent from "./components/route-info.js";
import RouteCostComponent from "./components/route-cost.js";
import MenuComponent from "./components/menu.js";
import NewPointComponent from "./components/new-point.js";
import {MenuElement} from "./const.js";
import FilterController from "./controllers/filter.js";
import {RenderPosition, render} from "./utils/render.js";
import TripController from "./controllers/trip.js";
import RoutePointsModel from "./models/points.js";
import TripComponent from "./components/trip.js";
import StatisticsComponent from "./components/statistics.js";

const AUTHORIZATION = `Basic er883jdzbdw`;
const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;

const api = new API(END_POINT, AUTHORIZATION);

const routePointsModel = new RoutePointsModel();

const tripMainElement = document.querySelector(`.trip-main`);

const routeInfo = new RouteInfoComponent();
const routeCoast = new RouteCostComponent();

const tripControls = tripMainElement.querySelector(`.trip-controls`);
const tripMenu = tripControls.querySelector(`h2`);
const mainMenu = new MenuComponent();
const filterController = new FilterController(tripControls, routePointsModel);
const tripEvents = document.querySelector(`.page-main .page-body__container`);
const statisticsComponent = new StatisticsComponent();
const tripComponent = new TripComponent();

let offersList = [];
let destinationsList = [];

const generateTripController = (routePoints) => {
  const tripController = new TripController(tripComponent, routePointsModel, routeCoast, routeInfo, filterController, statisticsComponent, offersList, destinationsList, api);

  const startSorditngRoutePoints = routePoints.sort((a, b) => a.eventStartDate - b.eventStartDate);

  const newPoint = new NewPointComponent();
  render(tripMainElement, newPoint, RenderPosition.BEFOREEND);

  newPoint.setOnClick(() => {
    tripController.createRoutePoint();
  });

  statisticsComponent.hide();
  tripController.show();

  mainMenu.setOnClick((menuItem) => {
    switch (menuItem) {
      case MenuElement.TABLE:
        tripController.setSortDefault();
        mainMenu.setActiveItem(MenuElement.TABLE);
        statisticsComponent.hide();
        tripController.show();
        break;
      case MenuElement.STATISTICS:
        tripController.setSortDefault();
        mainMenu.setActiveItem(MenuElement.STATISTICS);
        statisticsComponent.show();
        tripController.hide();
        break;
    }
  });

  routePointsModel.setRoutePoints(startSorditngRoutePoints);

  tripController.render(startSorditngRoutePoints);

  routeInfo.generate(startSorditngRoutePoints);
  render(tripMainElement, routeInfo, RenderPosition.AFTERBEGIN);

  routeCoast.calculate(startSorditngRoutePoints);
  const tripInfo = tripMainElement.querySelector(`.trip-info__main`);
  render(tripInfo, routeCoast, RenderPosition.AFTEREND);

  statisticsComponent.getData(startSorditngRoutePoints, offersList);
  statisticsComponent.hide();
};


mainMenu.setActiveItem(MenuElement.TABLE);
render(tripMenu, mainMenu, RenderPosition.AFTEREND);
filterController.render();

render(tripEvents, statisticsComponent, RenderPosition.AFTERBEGIN);
render(tripEvents, tripComponent, RenderPosition.BEFOREEND);

api.getOffers()
  .then((offers) => {
    offersList = offers;

    api.getDestinations()
      .then((destinations) => {
        destinationsList = destinations;

        api.getRoutePoints()
            .then((routePoints) => {
              generateTripController(routePoints);
            });
      });
  });
