import SortingComponent, {SortType} from "../components/sorting.js";
import NoRoutePoints from "../components/no-route-points.js";
import DaysComponent from "../components/days.js";
import DayComponent from "../components/day.js";
import {RenderPosition, render, remove} from "../utils/render.js";
import {getDatesDuration} from "../utils/common.js";
import PointController from "./point.js";

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

export default class TripController {
  constructor(container, routePointsModel) {
    this._routePointsModel = routePointsModel;
    this._showedRoutePointControllers = [];
    this._days = [];
    this._firstEventStartDate = routePointsModel.getRoutePoints()[0].eventStartDate;

    this._container = container;
    this._sortComponent = new SortingComponent();
    this._daysComponent = new DaysComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._routePointsModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    const tripEvents = this._container;
    const tripSorting = tripEvents.querySelector(`h2`);
    render(tripSorting, this._sortComponent, RenderPosition.AFTEREND);
    render(tripEvents, this._daysComponent, RenderPosition.BEFOREEND);

    this._renderRoutePoints();
  }

  _renderRoutePointsWithDays(daysComponent, routePoints, sortType, onDataChange, onViewChange) {
    let dayNumber = getDatesDuration(this._firstEventStartDate, routePoints[0].eventStartDate).daysBetween;
    let dayComponent = new DayComponent(dayNumber + 1, routePoints[0].eventStartDate, sortType !== SortType.EVENT);
    this._days.push(dayComponent);
    render(daysComponent.getElement(), dayComponent, RenderPosition.BEFOREEND);

    return routePoints.map((routePoint) => {
      if (getDatesDuration(this._firstEventStartDate, routePoint.eventStartDate).daysBetween > dayNumber && sortType === SortType.EVENT) {
        dayNumber = getDatesDuration(this._firstEventStartDate, routePoint.eventStartDate).daysBetween;
        dayComponent = new DayComponent(dayNumber + 1, routePoint.eventStartDate);
        this._days.push(dayComponent);
        render(daysComponent.getElement(), dayComponent, RenderPosition.BEFOREEND);
      }
      const pointController = new PointController(dayComponent.getElement().querySelector(`.trip-events__list`), onDataChange, onViewChange);
      pointController.render(routePoint);
      return pointController;
    });
  }

  _renderRoutePoints() {
    const routePoints = this._routePointsModel.getRoutePoints();

    if (routePoints.length <= 0) {
      render(this._daysComponent.getElement(), new NoRoutePoints(), RenderPosition.BEFOREEND);
      return;
    }

    const newRoutePoints = this._renderRoutePointsWithDays(this._daysComponent, routePoints, SortType.EVENT, this._onDataChange, this._onViewChange);
    this._showedRoutePointControllers = this._showedRoutePointControllers.concat(newRoutePoints);
  }

  _removeRoutePoints() {
    this._showedRoutePointControllers.forEach((routePointController) => routePointController.destroy());
    this._showedRoutePointControllers = [];
    this._days.forEach((day) => remove(day));
    this._days = [];
  }

  _updateRoutePoints() {
    this._removeRoutePoints();
    this._renderRoutePoints();
  }

  _onDataChange(pointController, oldData, newData) {
    const isSuccess = this._routePointsModel.updateRoutePoint(oldData.id, newData);

    if (isSuccess) {
      pointController.render(newData);
    }
  }

  _onViewChange() {
    this._showedRoutePointControllers.forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    const sortedRoutePoints = getSortedRoutePoints(this._routePointsModel.getRoutePoints(), sortType);
    if (sortedRoutePoints <= 0) {
      return;
    }
    this._daysComponent.getElement().innerHTML = ``;
    const newRoutePoints = this._renderRoutePointsWithDays(this._daysComponent, sortedRoutePoints, sortType, this._onDataChange, this._onViewChange);
    this._showedRoutePointControllers = newRoutePoints;
  }

  _onFilterChange() {
    this._updateRoutePoints();
  }
}
