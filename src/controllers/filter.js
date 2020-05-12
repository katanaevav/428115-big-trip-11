import FilterComponent from "../components/filter.js";
import {FilterType} from "../const.js";
import {render, replace, RenderPosition} from "../utils/render.js";
import {getRoutePointsByFilter} from "../utils/filter.js";

export default class FilterController {
  constructor(container, routePointsModel) {
    this._container = container;
    this._routePointModel = routePointsModel;

    this._activeFilterType = FilterType.EVERYTHING;
    this._filterComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._routePointModel.setDataChangeHandler(this._onDataChange);
  }

  filterAtStart() {
    this._filterComponent.setStartingFilterPosition();
  }

  render() {
    const container = this._container;
    const allRoutePoints = this._routePointModel.getRoutePointsAll();
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        count: getRoutePointsByFilter(allRoutePoints, filterType).length,
        checked: filterType === this._activeFilterType,
      };
    });
    const oldComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(container, this._filterComponent, RenderPosition.BEFOREEND);
    }
  }

  _onFilterChange(filterType) {
    this._routePointModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  _onDataChange() {
    this.render();
  }
}
