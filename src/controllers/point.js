import RoutePointComponent from "../components/route-point.js";
import RoutePointEditComponent from "../components/route-point-edit.js";
import {RenderPosition, render, remove, replace} from "../utils/render.js";
import {eventTypes, destinations} from "../mock/route-point.js";

const FIRST_ELEMENT = 0;

export const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
  ADDING: `adding`,
};

export const EmptyRoutePoint = {
  id: Date.now(),
  eventStartDate: Date.now(),
  eventEndDate: Date.now(),
  eventCoast: 0,
  eventOffers: [],
  eventType: eventTypes[FIRST_ELEMENT],
  eventDestination: destinations[FIRST_ELEMENT],
  eventIsFavorite: false,
};

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

  render(routePoint, mode = Mode.DEFAULT) {
    const oldRoutePointComponent = this._routePointComponent;
    const oldRoutePointEditComponent = this._routePointEditComponent;
    this._mode = mode;

    this._routePointComponent = new RoutePointComponent(routePoint);
    this._routePointEditComponent = new RoutePointEditComponent(routePoint, this._mode === Mode.ADDING);

    this._routePointComponent.setRollupButtonClickHandler(() => {
      this._openRoutePointEditForm();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._routePointEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const editedRoutePoint = this._routePointEditComponent.getData();
      this._onDataChange(this, routePoint, editedRoutePoint);
      document.removeEventListener(`keydown`, this._onEscKeyDown);
      this._colseRoutePointEditForm();

    });

    this._routePointEditComponent.setResetHandler((evt) => {
      evt.preventDefault();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
      this._colseRoutePointEditForm();
    });

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

    this._routePointEditComponent.setDeleteButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, routePoint, null);
    });

    switch (mode) {
      case Mode.DEFAULT:
        if (oldRoutePointComponent && oldRoutePointEditComponent) {
          replace(this._routePointComponent, oldRoutePointComponent);
          replace(this._routePointEditComponent, oldRoutePointEditComponent);
          document.removeEventListener(`keydown`, this._onEscKeyDown);
          remove(oldRoutePointComponent);
          remove(oldRoutePointEditComponent);
        } else {
          render(this._container, this._routePointComponent, RenderPosition.BEFOREEND);
        }
        break;
      case Mode.ADDING:
        if (oldRoutePointEditComponent && oldRoutePointComponent) {
          remove(oldRoutePointComponent);
          remove(oldRoutePointEditComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(this._container, this._routePointEditComponent, RenderPosition.AFTERBEGIN);
        break;
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._colseRoutePointEditForm();
    }
  }

  destroy() {
    remove(this._routePointEditComponent);
    remove(this._routePointComponent);
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
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, EmptyRoutePoint, null);
      }
      this._colseRoutePointEditForm();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

}
