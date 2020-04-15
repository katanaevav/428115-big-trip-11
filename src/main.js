const ROUTE_POINTS_COUNT = 15;

import RouteInfoComponent from "./components/routeInfo.js";
import RouteCostComponent from "./components/routeCost.js";
import MenuComponent from "./components/menu.js";
import FilterComponent from "./components/filter.js";
import SortingComponent from "./components/sorting.js";
import RoutePointEditComponent from "./components/routePointEdit.js";
import RoutePointComponent from "./components/routePoint.js";
import DaysComponent from "./components/days.js";
import DayComponent from "./components/day.js";
import {filterNames} from "./mock/filter.js";
import {getDatesDuration, RenderPosition, render} from "./utils.js";
import {generateRoutePoints} from "./mock/routePoint.js";

const tripMainElement = document.querySelector(`.trip-main`);
render(tripMainElement, new RouteInfoComponent().getElement(), RenderPosition.AFTERBEGIN);

const tripInfo = tripMainElement.querySelector(`.trip-info__main`);
render(tripInfo, new RouteCostComponent().getElement(), RenderPosition.AFTEREND);

const tripControls = tripMainElement.querySelector(`.trip-controls`);
const tripMenu = tripControls.querySelector(`h2`);
render(tripMenu, new MenuComponent().getElement(), RenderPosition.AFTEREND);
render(tripControls, new FilterComponent(filterNames).getElement(), RenderPosition.BEFOREEND);

const renderRoutePoint = (routePointList, routePoint) => {
  const onRollupButtonClick = () => {
    routePointList.replaceChild(routePointEditComponent.getElement(), routePointComponent.getElement());
  };

  const onEditFormSubmit = (evt) => {
    evt.preventDefault();
    routePointList.replaceChild(routePointComponent.getElement(), routePointEditComponent.getElement());
  };

  const routePointComponent = new RoutePointComponent(routePoint);
  const rollupButton = routePointComponent.getElement().querySelector(`.event__rollup-btn`);
  rollupButton.addEventListener(`click`, onRollupButtonClick);

  const routePointEditComponent = new RoutePointEditComponent(routePoint);
  const editForm = routePointEditComponent.getElement().querySelector(`form`);
  editForm.addEventListener(`submit`, onEditFormSubmit);

  render(routePointList, routePointComponent.getElement(), RenderPosition.BEFOREEND);
};

const renderRouteTable = (tripEvents, routePoints) => {
  const tripSorting = tripEvents.querySelector(`h2`);
  render(tripSorting, new SortingComponent().getElement(), RenderPosition.AFTEREND);

  const daysComponent = new DaysComponent();
  render(tripEvents, daysComponent.getElement(), RenderPosition.BEFOREEND);

  let dayNumber = 0;
  let dayComponent = new DayComponent(dayNumber + 1, routePoints[0].eventStartDate);
  render(daysComponent.getElement(), dayComponent.getElement(), RenderPosition.BEFOREEND);

  routePoints.forEach((routePoint) => {
    if (getDatesDuration(routePoints[0].eventStartDate, routePoint.eventStartDate).daysBetween > dayNumber) {
      dayNumber = getDatesDuration(routePoints[0].eventStartDate, routePoint.eventStartDate).daysBetween;
      dayComponent = new DayComponent(dayNumber + 1, routePoint.eventStartDate);
      render(daysComponent.getElement(), dayComponent.getElement(), RenderPosition.BEFOREEND);
    }
    renderRoutePoint(dayComponent.getElement().querySelector(`.trip-events__list`), routePoint);
  });
};

const tripEvents = document.querySelector(`.trip-events`);

const routePoints = generateRoutePoints(ROUTE_POINTS_COUNT).sort((a, b) => a.eventStartDate - b.eventStartDate);

renderRouteTable(tripEvents, routePoints);

