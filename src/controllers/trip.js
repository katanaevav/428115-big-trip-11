import SortingComponent, {SortType} from "../components/sorting.js";
import NoRoutePoints from "../components/no-route-points.js";
import DaysComponent from "../components/days.js";
import DayComponent from "../components/day.js";
import {RenderPosition, render, remove} from "../utils/render.js";
import {getDatesDuration} from "../utils/common.js";
import PointController, {Mode as RoutePointControllerMode, EmptyRoutePoint} from "./point.js";

const getSortedRoutePoints = (routePoints, sortType) => {
  let sortedRoutePoints = [];

  const showingRoutePoints = routePoints.slice();

  switch (sortType) {
    case SortType.EVENT:
      sortedRoutePoints = showingRoutePoints.sort((a, b) => parseInt(a.eventStartDate, 10) - parseInt(b.eventStartDate, 10));
      break;
    case SortType.TIME:
      sortedRoutePoints = showingRoutePoints.sort((a, b) => (parseInt(b.eventEndDate, 10) - parseInt(b.eventStartDate, 10)) - (parseInt(a.eventEndDate, 10) - parseInt(a.eventStartDate, 10)));
      break;
    case SortType.PRICE:
      sortedRoutePoints = showingRoutePoints.sort((a, b) => parseInt(b.eventCoast, 10) - parseInt(a.eventCoast, 10));
      break;
  }

  return sortedRoutePoints.slice();
};

export default class TripController {
  constructor(container, routePointsModel, routeCoast, routeInfo) {
    this._routePointsModel = routePointsModel;
    this._sortType = SortType.EVENT;
    this._routeCoast = routeCoast;
    this._routeInfo = routeInfo;
    this._showedRoutePointControllers = [];
    this._days = [];

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

    this._renderRoutePoints(this._routePointsModel.getRoutePoints(), SortType.EVENT);
  }

  _renderRoutePointsWithDays(daysComponent, routePoints, sortType, onDataChange, onViewChange) {
    const firstEventStartDate = (routePoints.map((it) => parseInt(it.eventStartDate, 10)).sort((a, b) => a - b)[0]);

    let dayNumber = getDatesDuration(firstEventStartDate, routePoints[0].eventStartDate).daysBetween;
    let dayComponent = new DayComponent(dayNumber + 1, routePoints[0].eventStartDate, sortType !== SortType.EVENT);
    this._days.push(dayComponent);
    render(daysComponent.getElement(), dayComponent, RenderPosition.BEFOREEND);

    return routePoints.map((routePoint) => {
      if (getDatesDuration(firstEventStartDate, routePoint.eventStartDate).daysBetween > dayNumber && sortType === SortType.EVENT) {
        dayNumber = getDatesDuration(firstEventStartDate, routePoint.eventStartDate).daysBetween;
        dayComponent = new DayComponent(dayNumber + 1, routePoint.eventStartDate);
        this._days.push(dayComponent);
        render(daysComponent.getElement(), dayComponent, RenderPosition.BEFOREEND);
      }
      const routePointController = new PointController(dayComponent.getElement().querySelector(`.trip-events__list`), onDataChange, onViewChange);
      routePointController.render(routePoint, RoutePointControllerMode.DEFAULT);
      return routePointController;
    });
  }

  _renderRoutePoints(routePoints, sortType) {
    if (routePoints.length <= 0) {
      render(this._daysComponent.getElement(), new NoRoutePoints(), RenderPosition.BEFOREEND);
      return;
    }

    const newRoutePoints = this._renderRoutePointsWithDays(this._daysComponent, routePoints, sortType, this._onDataChange, this._onViewChange);
    this._showedRoutePointControllers = this._showedRoutePointControllers.concat(newRoutePoints);
  }

  _removeRoutePoints() {
    this._showedRoutePointControllers.forEach((routePointController) => routePointController.destroy());
    this._showedRoutePointControllers = [];
    this._days.forEach((day) => remove(day));
    this._days = [];
  }

  _updateRoutePoints(sortType = SortType.EVENT) {
    this._removeRoutePoints();
    this._renderRoutePoints(this._routePointsModel.getRoutePoints(), sortType);
  }

  _onDataChange(routePointController, oldData, newData) {
    if (oldData === EmptyRoutePoint) {
      this._creatingRoutePoint = null;
      if (newData === null) {
        routePointController.destroy();
        this._updateRoutePoints();
      } else {
        this._routePointsModel.addRoutePoint(newData);
        routePointController.render(newData, RoutePointControllerMode.DEFAULT);

        this._showedRoutePointControllers = [].concat(routePointController, this._showedRoutePointControllers);
      }
    } else if (newData === null) {
      this._routePointsModel.removeRoutePoint(oldData.id);
      this._updateRoutePoints(this._sortType);
    } else {
      const isSuccess = this._routePointsModel.updateRoutePoint(oldData.id, newData);
      if (isSuccess) {
        routePointController.render(newData);
      }
      this._onSortTypeChange(this._sortType);
    }
    this._routeCoast.calculate(this._routePointsModel.getRoutePoints());
    this._routeInfo.generate(this._routePointsModel.getRoutePoints());
  }

  _onViewChange() {
    this._showedRoutePointControllers.forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    const sortedRoutePoints = getSortedRoutePoints(this._routePointsModel.getRoutePoints(), sortType);

    if (sortedRoutePoints <= 0) {
      return;
    }

    this._sortType = sortType;

    this._removeRoutePoints();
    this._renderRoutePoints(sortedRoutePoints, sortType);
  }

  _onFilterChange() {
    this._updateRoutePoints();
    this._sortComponent.setStartingSortPosition();
  }
}
