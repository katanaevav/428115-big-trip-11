import API from "./api/index.js";
import Provider from "./api/provider.js";
import Store from "./api/store.js";
import RouteInfoComponent from "./components/route-info.js";
import RouteCostComponent from "./components/route-cost.js";
import MenuComponent from "./components/menu.js";
import NewPointComponent from "./components/new-point.js";
import {MenuElement} from "./const.js";
import FilterController from "./controllers/filter.js";
import {RenderPosition, render, remove} from "./utils/render.js";
import TripController from "./controllers/trip.js";
import RoutePointsModel from "./models/points.js";
import TripComponent from "./components/trip.js";
import StatisticsComponent from "./components/statistics.js";
import NoRoutePoints from "./components/no-route-points.js";

const AUTHORIZATION = `Basic er883jdzbdw`;
const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;
const STORE_PROJECT_NAME = `big-trip-localstorage`;
const STORE_VERSION = `v1`;
const STORE_OFFERS = `offers`;
const STORE_DESTINATIONS = `destinations`;
const STORE_ROUTE_POINTS = `route-points`;
const STORE_NAME = `${STORE_PROJECT_NAME}-${STORE_VERSION}`;

const api = new API(END_POINT, AUTHORIZATION);
const offersStore = new Store(`${STORE_OFFERS}-${STORE_NAME}`, window.localStorage);
const destinationStore = new Store(`${STORE_DESTINATIONS}-${STORE_NAME}`, window.localStorage);
const routePointsStore = new Store(`${STORE_ROUTE_POINTS}-${STORE_NAME}`, window.localStorage);
const apiWithProvider = new Provider(api, offersStore, destinationStore, routePointsStore);

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
  const tripController = new TripController(tripComponent, routePointsModel, routeCoast, routeInfo, filterController, statisticsComponent, offersList, destinationsList, apiWithProvider);

  const startSorditngRoutePoints = routePoints.sort((a, b) => a.eventStartDate - b.eventStartDate);

  const newPoint = new NewPointComponent();
  render(tripMainElement, newPoint, RenderPosition.BEFOREEND);

  newPoint.setOnClick(() => {
    tripController.createRoutePoint();
  });

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
        statisticsComponent.getData(routePointsModel.getRoutePointsAll(), offersList);
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
statisticsComponent.hide();

const tripEventsSection = document.querySelector(`.trip-events`);
const noRoutePoints = new NoRoutePoints();
noRoutePoints.setLoading();
render(tripEventsSection, noRoutePoints, RenderPosition.BEFOREEND);

Promise.all([
  apiWithProvider.getOffers(),
  apiWithProvider.getDestinations(),
  apiWithProvider.getRoutePoints(),
])
.then((result) => {
  offersList = result[0];
  destinationsList = result[1];
  remove(noRoutePoints);
  generateTripController(result[2]);
})
.catch(() => {
  noRoutePoints.setError();
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  apiWithProvider.sync();
});

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
