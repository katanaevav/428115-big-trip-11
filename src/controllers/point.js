import RoutePointComponent from "../components/route-point.js";
import RoutePointEditComponent from "../components/route-point-edit.js";
import {RenderPosition, render, remove, replace} from "../utils/render.js";
import RoutePointModel from "../models/point.js";
import {EcapeKeysValues} from "../const.js";

const ON_VALUE = `on`;
const FIRST_ELEMENT = 0;
const SHAKE_ANIMATION_TIMEOUT = 600;

export const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
  ADDING: `adding`,
};

const parseFormData = (formData, eventTypes, destinations) => {
  let selectedOffers = [];
  for (let key of formData.keys()) {
    if (key.startsWith(`event-offer`)) {
      selectedOffers.push(key.substring(12));
    }
  }
  const eventTypeStructure = eventTypes.find((it) => it.name.toLowerCase() === formData.get(`event-type-data`).toLowerCase());

  let selectedDestination = {};

  const destination = destinations.find(((it) => {
    return it.name === formData.get(`event-destination`);
  }));
  selectedDestination.name = destination.name;
  selectedDestination.description = destination.description;
  selectedDestination.pictures = destination.photos;

  const routePointModel = new RoutePointModel({
    "id": formData.get(`event-id`),
    "date_from": (formData.get(`event-start-time`)),
    "date_to": (formData.get(`event-end-time`)),
    "base_price": formData.get(`event-price`),
    "is_favorite": formData.get(`event-favorite`) === ON_VALUE,

    "offers": eventTypeStructure.offers.filter((offer) => {
      return selectedOffers.includes(offer.key);
    }).map((it) => ({
      title: it.name,
      price: it.coast,
      key: it.key,
    })),

    "destination": selectedDestination,
    "type": formData.get(`event-type-data`),
  });

  return routePointModel;
};

export const getEmptyRoutePoint = (offersList, destinationsList) => {
  return {
    id: null,
    eventStartDate: Date.now(),
    eventEndDate: Date.now(),
    eventCoast: 0,
    eventOffers: [],
    eventType: offersList[FIRST_ELEMENT].name,
    eventDestination: destinationsList[FIRST_ELEMENT],
    eventIsFavorite: false,
  };
};

export default class PointController {
  constructor(container, onDataChange, onViewChange, offersList, destinationsList) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._offersList = offersList;
    this._destinationsList = destinationsList;

    this._mode = Mode.DEFAULT;
    this._routePointComponent = null;
    this._routePointEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this.colseRoutePointEditForm = this.colseRoutePointEditForm.bind(this);
    this._openRoutePointEditForm = this._openRoutePointEditForm.bind(this);
  }

  render(routePoint, mode = Mode.DEFAULT) {
    const oldRoutePointComponent = this._routePointComponent;
    const oldRoutePointEditComponent = this._routePointEditComponent;
    this._mode = mode;

    this._routePointComponent = new RoutePointComponent(routePoint, this._offersList);
    this._routePointEditComponent = new RoutePointEditComponent(routePoint, this._mode === Mode.ADDING, this._offersList, this._destinationsList);

    this._routePointComponent.setRollupButtonClickHandler(() => {
      this._openRoutePointEditForm();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._routePointEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._routePointEditComponent.setSubmitButtonText(mode === Mode.ADDING, true);
      const formData = this._routePointEditComponent.getData();
      const routePointData = parseFormData(formData, this._offersList, this._destinationsList);
      this.disableForm();
      this._onDataChange(this, routePoint, routePointData);
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    this._routePointEditComponent.setResetHandler((evt) => {
      evt.preventDefault();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
      this.colseRoutePointEditForm();
    });

    this._routePointEditComponent.setRollupButtonClickHandler((evt) => {
      evt.preventDefault();
      this.colseRoutePointEditForm();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    this._routePointEditComponent.setFavoriteButtonClickHandler(() => {
      const newRoutePoint = RoutePointModel.clone(routePoint);
      newRoutePoint.eventIsFavorite = !newRoutePoint.eventIsFavorite;
      this.disableForm();
      this._onDataChange(this, routePoint, newRoutePoint, false);
    });

    this._routePointEditComponent.setDeleteButtonClickHandler((evt) => {
      evt.preventDefault();
      if (mode === Mode.ADDING) {
        this._onViewChange();
      } else {
        this._routePointEditComponent.setResetButtonText(mode === Mode.ADDING, true);
        this.disableForm();
        this._onDataChange(this, routePoint, null);
      }
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
        this._routePointEditComponent.applyFlatpickr();
        break;
      case Mode.EDIT:
        if (oldRoutePointEditComponent && oldRoutePointComponent) {
          remove(oldRoutePointComponent);
          remove(oldRoutePointEditComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(this._container, this._routePointEditComponent, RenderPosition.AFTERBEGIN);
        this._routePointEditComponent.applyFlatpickr();
        break;
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this.colseRoutePointEditForm();
    }
  }

  resetButtonTexts() {
    this._routePointEditComponent.setResetButtonText(this._mode === Mode.ADDING, false);
    this._routePointEditComponent.setSubmitButtonText(this._mode === Mode.ADDING, false);
  }

  disableForm() {
    if (this._routePointEditComponent.getElement().classList.contains(`border-error`)) {
      this._routePointEditComponent.getElement().classList.remove(`border-error`);
    }
    if (this._routePointComponent.getElement().classList.contains(`border-error`)) {
      this._routePointComponent.getElement().classList.remove(`border-error`);
    }

    this._routePointEditComponent.setDisableForm(true);
  }

  enableForm() {
    this._routePointEditComponent.setDisableForm(false);
  }

  destroy() {
    remove(this._routePointEditComponent);
    remove(this._routePointComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  shake() {
    this._routePointEditComponent.getElement().classList.add(`shake`);
    this._routePointComponent.getElement().classList.add(`shake`);
    this._routePointEditComponent.getElement().classList.add(`border-error`);
    this._routePointComponent.getElement().classList.add(`border-error`);

    setTimeout(() => {
      this._routePointEditComponent.getElement().classList.remove(`shake`);
      this._routePointComponent.getElement().classList.remove(`shake`);
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  colseRoutePointEditForm() {
    this._routePointEditComponent.reset();
    if (document.contains(this._routePointEditComponent.getElement())) {
      replace(this._routePointComponent, this._routePointEditComponent);
    }
    this._mode = Mode.DEFAULT;
    this._routePointEditComponent.destroyFlatpickr();
  }

  _openRoutePointEditForm() {
    replace(this._routePointEditComponent, this._routePointComponent);
    this._onViewChange();
    this._mode = Mode.EDIT;
    this._routePointEditComponent.applyFlatpickr();
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === EcapeKeysValues.FULL || evt.key === EcapeKeysValues.SHORT;

    if (isEscKey) {
      if (this._mode === Mode.ADDING) {
        this._onViewChange();
      }
      this.colseRoutePointEditForm();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

}
