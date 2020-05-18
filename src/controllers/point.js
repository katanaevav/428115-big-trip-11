import RoutePointComponent from "../components/route-point.js";
import RoutePointEditComponent from "../components/route-point-edit.js";
import {RenderPosition, render, remove, replace} from "../utils/render.js";
import RoutePointModel from "../models/point.js";

const FIRST_ELEMENT = 0;

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
  const eventTypeIndex = eventTypes.findIndex((it) => it.name.toLowerCase() === formData.get(`event-type-data`).toLowerCase());
  const eventTypeStructure = eventTypes[eventTypeIndex];

  // eventTypeStructure.title = eventTypes[eventTypeIndex].name;
  // eventTypeStructure.price = eventTypes[eventTypeIndex].coast;
  // eventTypeStructure.key = eventTypes[eventTypeIndex].key;

  // .map((it) => ({
  //   title: it.name,
  //   price: it.coast,
  //   key: it.key,
  // }));

  const selectedDestination = destinations.find(((destination) => {
    return destination.name === formData.get(`event-destination`);
  }));

  const routePointModel = new RoutePointModel({
    id: formData.get(`event-id`),
    eventStartDate: formData.get(`event-start-time`),
    eventEndDate: formData.get(`event-end-time`),
    eventCoast: parseInt(formData.get(`event-price`), 10),
    eventIsFavorite: formData.get(`event-favorite`) === `true`,

    offers: eventTypeStructure.offers.slice().filter((offer) => {
      return selectedOffers.includes(offer.key);
    }).map((it) => ({
      title: it.name,
      price: it.coast,
      key: it.key,
    })),

    eventDestination: selectedDestination,
    type: formData.get(`event-type-data`),
  });

  console.log(routePointModel);

  // let selectedOffers = [];
  // for (let key of formData.keys()) {
  //   if (key.startsWith(`event-offer`)) {
  //     selectedOffers.push(key.substring(12));
  //   }
  // }

  // const selectedDestination = destinations.find(((destination) => {
  //   return destination.name === formData.get(`event-destination`);
  // }));

  // const eventTypeIndex = eventTypes.findIndex((it) => it.name.toLowerCase() === formData.get(`event-type-data`).toLowerCase());
  // const eventTypeStructure = eventTypes[eventTypeIndex];

  // return new RoutePointModel({
  //   id: formData.get(`event-id`),
  //   eventType: formData.get(`event-type-data`), // eventTypeData,
  //   eventDestination: selectedDestination,
  //   eventStartDate: Date.parse(formData.get(`event-start-time`)),
  //   eventEndDate: Date.parse(formData.get(`event-end-time`)),
  //   eventCoast: parseInt(formData.get(`event-price`), 10),

  //   eventOffers: eventTypeStructure.offers.slice().filter((offer) => {
  //     return selectedOffers.includes(offer.key);
  //   }),

  //   eventIsFavorite: formData.get(`event-favorite`) === `true`,
  // });
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
    this._colseRoutePointEditForm = this._colseRoutePointEditForm.bind(this);
    this._openRoutePointEditForm = this._openRoutePointEditForm.bind(this);
  }

  static getEmptyRoutePoint(offersList, destinationsList) {
    return {
      id: Date.now(),
      eventStartDate: Date.now(),
      eventEndDate: Date.now(),
      eventCoast: 0,
      eventOffers: [],
      eventType: offersList[FIRST_ELEMENT].name,
      eventDestination: destinationsList[FIRST_ELEMENT],
      eventIsFavorite: false,
    };
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
      // const editedRoutePoint = this._routePointEditComponent.getData();
      // this._onDataChange(this, routePoint, editedRoutePoint);
      // document.removeEventListener(`keydown`, this._onEscKeyDown);
      // this._colseRoutePointEditForm();

      const formData = this._routePointEditComponent.getData();
      const data = parseFormData(formData, this._offersList, this._destinationsList);
      this._onDataChange(this, routePoint, data);
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
      // this._onDataChange(this, routePoint, Object.assign({}, routePoint, {
      //   eventIsFavorite: !routePoint.eventIsFavorite,
      // }), false);
      const newRoutePoint = RoutePointModel.clone(routePoint);
      newRoutePoint.isFavorite = !newRoutePoint.isFavorite;

      this._onDataChange(this, routePoint, newRoutePoint);
    });

    this._routePointEditComponent.setDeleteButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, routePoint, null);
      if (mode === Mode.ADDING) {
        this._onViewChange();
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
    this._routePointEditComponent.destroyFlatpickr();
  }

  _openRoutePointEditForm() {
    replace(this._routePointEditComponent, this._routePointComponent);
    this._onViewChange();
    this._mode = Mode.EDIT;
    this._routePointEditComponent.applyFlatpickr();
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, this.getEmptyRoutePoint(this._offersList, this._destinationsList), null);
      }
      this._colseRoutePointEditForm();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

}
