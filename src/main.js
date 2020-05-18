// const ROUTE_POINTS_COUNT = 10;

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

// const routePoints = generateRoutePoints(ROUTE_POINTS_COUNT).sort((a, b) => a.eventStartDate - b.eventStartDate);

const api = new API(AUTHORIZATION);

const routePointsModel = new RoutePointsModel();

const tripMainElement = document.querySelector(`.trip-main`);

const routeInfo = new RouteInfoComponent();
const routeCoast = new RouteCostComponent();

const tripControls = tripMainElement.querySelector(`.trip-controls`);
const tripMenu = tripControls.querySelector(`h2`);
const mainMenu = new MenuComponent();
mainMenu.setActiveItem(MenuElement.TABLE);
render(tripMenu, mainMenu, RenderPosition.AFTEREND);

const filterController = new FilterController(tripControls, routePointsModel);
filterController.render();

const tripEvents = document.querySelector(`.page-main .page-body__container`);

const statisticsComponent = new StatisticsComponent();
render(tripEvents, statisticsComponent, RenderPosition.AFTERBEGIN);

const tripComponent = new TripComponent();
render(tripEvents, tripComponent, RenderPosition.BEFOREEND);

let offersList = [];
let destinationsList = [];

const generateTripController = (routePoints) => {
  const tripController = new TripController(tripComponent, routePointsModel, routeCoast, routeInfo, filterController, statisticsComponent, offersList, destinationsList, api);


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

  routePointsModel.setRoutePoints(routePoints);

  tripController.render(routePoints);

  routeInfo.generate(routePoints);
  render(tripMainElement, routeInfo, RenderPosition.AFTERBEGIN);

  routeCoast.calculate(routePoints);
  const tripInfo = tripMainElement.querySelector(`.trip-info__main`);
  render(tripInfo, routeCoast, RenderPosition.AFTEREND);

  statisticsComponent.getData(routePoints, offersList);
  statisticsComponent.hide();
};

api.getOffers()
  .then((offers) => {
    offersList = offers;
    console.log(offersList);

    api.getDestinations()
      .then((destinations) => {
        destinationsList = destinations;
        console.log(destinationsList);

        api.getRoutePoints()
            .then((routePoints) => {
              console.log(routePoints);
              generateTripController(routePoints);
            });
      });
  });
