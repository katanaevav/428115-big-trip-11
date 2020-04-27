import SortingComponent, {SortType} from "../components/sorting.js";
import RoutePointEditComponent from "../components/route-point-edit.js";
import RoutePointComponent from "../components/route-point.js";
import NoRoutePoints from "../components/no-route-points.js";
import DaysComponent from "../components/days.js";
import DayComponent from "../components/day.js";
import {RenderPosition, render, replace} from "../utils/render.js";
import {getDatesDuration} from "../utils/common.js";

const renderRoutePoint = (routePointList, routePoint) => {
  const colseRoutePointEditForm = () => {
    replace(routePointComponent, routePointEditComponent);
  };

  const openRoutePointEditForm = () => {
    replace(routePointEditComponent, routePointComponent);
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      colseRoutePointEditForm();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const onRollupButtonClick = () => {
    openRoutePointEditForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  const onEditFormSubmit = (evt) => {
    evt.preventDefault();
    colseRoutePointEditForm();
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  const onEditFormReset = (evt) => {
    evt.preventDefault();
    colseRoutePointEditForm();
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  const routePointComponent = new RoutePointComponent(routePoint);
  routePointComponent.setRollupButtonClickHandler(onRollupButtonClick);

  const routePointEditComponent = new RoutePointEditComponent(routePoint);
  routePointEditComponent.setSubmitHandler(onEditFormSubmit);
  routePointEditComponent.setResetHandler(onEditFormReset);

  render(routePointList, routePointComponent.getElement(), RenderPosition.BEFOREEND);
};

const getSortedRoutePoints = (routePoints, sortType) => {
  let sortedRoutePoints = [];
  const showingRoutePoints = routePoints.slice();

  switch (sortType) {
    case SortType.EVENT:
      sortedRoutePoints = showingRoutePoints;
      break;
    case SortType.TIME:
      sortedRoutePoints = showingRoutePoints.sort((a, b) => (b.eventEndDate - b.eventStartDate) - (a.eventEndDate - a.eventStartDate));
      break;
    case SortType.PRICE:
      sortedRoutePoints = showingRoutePoints.sort((a, b) => b.eventCoast - a.eventCoast);
      break;
  }

  return sortedRoutePoints.slice();
};

const renderRoutePoints = (daysComponent, routePoints, sortType) => {
  if (routePoints.length > 0) {
    let dayNumber = 0;
    let dayComponent = new DayComponent(dayNumber + 1, routePoints[0].eventStartDate, sortType !== SortType.EVENT);
    render(daysComponent.getElement(), dayComponent.getElement(), RenderPosition.BEFOREEND);

    routePoints.forEach((routePoint) => {
      if (getDatesDuration(routePoints[0].eventStartDate, routePoint.eventStartDate).daysBetween > dayNumber && sortType === SortType.EVENT) {
        dayNumber = getDatesDuration(routePoints[0].eventStartDate, routePoint.eventStartDate).daysBetween;
        dayComponent = new DayComponent(dayNumber + 1, routePoint.eventStartDate);
        render(daysComponent.getElement(), dayComponent.getElement(), RenderPosition.BEFOREEND);
      }
      renderRoutePoint(dayComponent.getElement().querySelector(`.trip-events__list`), routePoint);
    });
  } else {
    render(daysComponent.getElement(), new NoRoutePoints().getElement(), RenderPosition.BEFOREEND);
  }
};


export default class TripController {
  constructor(container) {
    this._container = container;
    this._sortComponent = new SortingComponent();
  }

  render(routePoints) {
    const tripEvents = this._container;
    const tripSorting = tripEvents.querySelector(`h2`);
    render(tripSorting, this._sortComponent.getElement(), RenderPosition.AFTEREND);

    const daysComponent = new DaysComponent();
    render(tripEvents, daysComponent.getElement(), RenderPosition.BEFOREEND);

    renderRoutePoints(daysComponent, routePoints, SortType.EVENT);

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      const sortedRoutePoints = getSortedRoutePoints(routePoints, sortType);
      daysComponent.getElement().innerHTML = ``;
      renderRoutePoints(daysComponent, sortedRoutePoints, sortType);
    });
  }
}
