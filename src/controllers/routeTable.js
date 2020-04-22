import SortingComponent from "../components/sorting.js";
import RoutePointEditComponent from "../components/routePointEdit.js";
import RoutePointComponent from "../components/routePoint.js";
import NoRoutePoints from "../components/noRoutePoints.js";
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

const renderRouteTable = (tripEvents, routePoints) => {
  const tripSorting = tripEvents.querySelector(`h2`);
  render(tripSorting, new SortingComponent().getElement(), RenderPosition.AFTEREND);

  const daysComponent = new DaysComponent();
  render(tripEvents, daysComponent.getElement(), RenderPosition.BEFOREEND);

  if (routePoints.length > 0) {
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
  } else {
    render(daysComponent.getElement(), new NoRoutePoints().getElement(), RenderPosition.BEFOREEND);
  }
};

export default class TripController {
  constructor(container) {
    this._container = container;
  }

  render(routePoints) {
    renderRouteTable(this._container, routePoints);
  }
}
