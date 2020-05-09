import RoutePointComponent from "../components/route-point.js";
import RoutePointEditComponent from "../components/route-point-edit.js";
import {RenderPosition, render, remove, replace} from "../utils/render.js";

export const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
  ADDING: `add`,
};

export const EmptyRoutePoint = {};

export default class PointController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._mode = Mode.DEFAULT;
    this._routePointComponent = null;
    this._routePointEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._colseRoutePointEditForm = this._colseRoutePointEditForm.bind(this);
    this._openRoutePointEditForm = this._openRoutePointEditForm.bind(this);
  }

  render(routePoint, mode) {
    const oldRoutePointComponent = this._routePointComponent;
    const oldRoutePointEditComponent = this._routePointEditComponent;
    this._mode = mode;

    this._routePointComponent = new RoutePointComponent(routePoint);
    this._routePointEditComponent = new RoutePointEditComponent(routePoint);

    this._routePointComponent.setRollupButtonClickHandler(() => {
      this._openRoutePointEditForm();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._routePointEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const data = this._routePointEditComponent.getData();
      this._onDataChange(this, routePoint, data);
      document.removeEventListener(`keydown`, this._onEscKeyDown);
      this._colseRoutePointEditForm();
    });

    this._routePointEditComponent.setResetHandler((evt) => {
      evt.preventDefault();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
      this._colseRoutePointEditForm();
    });

    /* -------------------------Edit form------------------------------------*/
    this._routePointEditComponent.setRollupButtonClickHandler((evt) => {
      evt.preventDefault();
      this._colseRoutePointEditForm();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    this._routePointEditComponent.setFavoriteButtonClickHandler(() => {
      this._onDataChange(this, routePoint, Object.assign({}, routePoint, {
        eventIsFavorite: !routePoint.eventIsFavorite,
      }));
    });
    /* -------------------------Edit form-----------------------------------*/

    this._routePointEditComponent.setDeleteButtonClickHandler(() => this._onDataChange(this, routePoint, null));

    if (oldRoutePointComponent && oldRoutePointEditComponent) {
      replace(this._routePointComponent, oldRoutePointComponent);
      replace(this._routePointEditComponent, oldRoutePointEditComponent);
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    } else {
      render(this._container, this._routePointComponent, RenderPosition.BEFOREEND);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._colseRoutePointEditForm();
    }
  }

  destroy() {
    remove(this._routePointComponent);
    remove(this._routePointEditComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _colseRoutePointEditForm() {
    this._routePointEditComponent.reset();
    if (document.contains(this._routePointEditComponent.getElement())) {
      replace(this._routePointComponent, this._routePointEditComponent);
    }
    this._mode = Mode.DEFAULT;
  }

  _openRoutePointEditForm() {
    replace(this._routePointEditComponent, this._routePointComponent);
    this._onViewChange();
    this._mode = Mode.EDIT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._colseRoutePointEditForm();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

}