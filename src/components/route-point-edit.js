import {uniqueItems, pretextFromEventType} from "../utils/common.js";
import {eventTypes, destinations} from "../mock/route-point.js";
import AbstractSmartComponent from "./abstract-smart-component.js";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

const ResetButtonCaptions = {
  NEW_ROUTE_POINT: `Cancel`,
  EDIT_ROUTE_POINT: `Delete`,
};

const generateEventTypeTemplate = (eventName) => {
  const lowerCaseName = eventName.toLowerCase();
  return (
    `<div class="event__type-item">
      <input id="event-type-${lowerCaseName}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${lowerCaseName}">
      <label class="event__type-label  event__type-label--${lowerCaseName}" for="event-type-${lowerCaseName}-1">${eventName}</label>
    </div>`
  );
};

const generateEventTypesListTemplate = (events) => {
  const groups = uniqueItems(events.map((it) => it.type));
  return groups.map((group) =>
    `<fieldset class="event__type-group">
      <legend class="visually-hidden">${group}</legend>
      ${events.slice()
        .filter((it) => it.type === group)
        .map((it) => generateEventTypeTemplate(it.name)).join(`\n`)}
    </fieldset>`
  ).join(`\n`);
};

const genetateFavoriteButton = (checked, isNewRoutePoint) => {
  let favoriteButtonTemplate = ``;
  if (!isNewRoutePoint) {
    favoriteButtonTemplate = `<input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${checked}>
      <label class="event__favorite-btn" for="event-favorite-1">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </label>`;
  }
  return favoriteButtonTemplate;
};

const generateRollupButton = (isNewRoutePoint) => {
  let rollupButtonTemplate = ``;
  if (!isNewRoutePoint) {
    rollupButtonTemplate = `<button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
      </button>`;
  }
  return rollupButtonTemplate;
};

const generateOfferTemplate = (offer, selected) => {
  const {name, key, coast} = offer;
  const checked = selected > -1 ? `checked` : ``;

  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${key}-1" type="checkbox" name="event-offer-${key}" ${checked}>
      <label class="event__offer-label" for="event-offer-${key}-1">
        <span class="event__offer-title">${name}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${coast}</span>
      </label>
    </div>`
  );
};

const genearteOfferSection = (selectedEventType, eventOffers) => {
  const offersTemplate = selectedEventType.offers.map((it) =>
    generateOfferTemplate(it,
        eventOffers.findIndex((selectedOffers) => {
          return it.name === selectedOffers.name;
        }))).join(`\n`);

  let sectionTemplate = ``;

  if (selectedEventType.offers.length > 0) {
    sectionTemplate =
      `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
          ${offersTemplate}
        </div>
      </section>`;
  }

  return sectionTemplate;
};

const generatePictureTemplate = (picture) => {
  return (
    `<img class="event__photo" src="${picture}" alt="Event photo">`
  );
};

const generateDestinationSection = (selectedEventDestination) => {
  let sectionTemplate = ``;

  if (selectedEventDestination.description.length > 0) {
    const picturesTemplate = selectedEventDestination.photos.map((it) => generatePictureTemplate(it)).join(`\n`);
    sectionTemplate =
      `<section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${selectedEventDestination.description}</p>

        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${picturesTemplate}
          </div>
        </div>
      </section>`;
  }

  return sectionTemplate;
};

const generateDetailSection = (selectedEventType, eventOffers, selectedEventDestination) => {
  let sectionTemplate = ``;
  const offer = genearteOfferSection(selectedEventType, eventOffers);
  const destination = generateDestinationSection(selectedEventDestination);

  if (offer.length > 0 || destination.length > 0) {
    sectionTemplate =
      `<section class="event__details">
        ${offer}
        ${destination}
      </section>`;
  }

  return sectionTemplate;
};


const createRoutePointEditTemplate = (routePoint, options = {}, isNewRoutePoint) => {
  const {eventStartDate, eventEndDate, eventCoast, eventOffers, eventIsFavorite} = routePoint;
  const {selectedEventType, selectedEventDestination} = options;

  const eventName = selectedEventType.name;
  const eventAction = pretextFromEventType(selectedEventType.type);

  const resetButtonCaption = isNewRoutePoint ? ResetButtonCaptions.NEW_ROUTE_POINT : ResetButtonCaptions.EDIT_ROUTE_POINT;
  const destination = selectedEventDestination.name;
  const isFavorite = eventIsFavorite ? `checked` : ``;

  return (
    `<li class="trip-events__item">
      <form class="trip-events__item  event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${eventName.toLowerCase()}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              ${generateEventTypesListTemplate(eventTypes)}
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
            ${eventName} ${eventAction}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" list="destination-list-1">
            <datalist id="destination-list-1">
              <option value="Amsterdam"></option>
              <option value="Geneva"></option>
              <option value="Chamonix"></option>
              <option value="Saint Petersburg"></option>
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">
              From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${eventStartDate}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${eventEndDate}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${eventCoast}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">${resetButtonCaption}</button>

          ${genetateFavoriteButton(isFavorite, isNewRoutePoint)}
          ${generateRollupButton(isNewRoutePoint)}

        </header>

        ${generateDetailSection(selectedEventType, eventOffers, selectedEventDestination)}

      </form>
    </li>`
  );
};

const parseFormData = (formData, eventTypeData) => {
  let selectedOffers = [];
  for (let key of formData.keys()) {
    if (key.startsWith(`event-offer`)) {
      selectedOffers.push(key.substring(12));
    }
  }

  const selectedDestination = destinations.find(((destination) => {
    return destination.name === formData.get(`event-destination`);
  }));

  return {
    id: formData.get(`event-id`),
    eventType: eventTypeData,
    eventDestination: selectedDestination,
    eventStartDate: Date.parse(formData.get(`event-start-time`)),
    eventEndDate: Date.parse(formData.get(`event-end-time`)),
    eventCoast: formData.get(`event-price`),
    eventOffers: eventTypeData.offers.slice().filter((offer) => {
      return selectedOffers.includes(offer.key);
    }),
    eventIsFavorite: formData.get(`event-favorite`) === `true`,
  };
};

export default class RoutePoint extends AbstractSmartComponent {
  constructor(routePoint) {
    super();

    this._eventType = routePoint.eventType;
    this._eventDestination = routePoint.eventDestination;
    this._routePoint = routePoint;
    this._isNewRoutePoint = routePoint === null;
    this._submitHandler = null;
    this._resetHandler = null;
    this._rollupButtonClickHandler = null;
    this._favoriteButtonClickHandler = null;
    this._flatpickrStart = null;
    this._flatpickrEnd = null;
    this._deleteButtonClickHandler = null;

    this._applyFlatpickr();
    this._subscribeOnEvents();
  }

  reset() {
    const routePoint = this._routePoint;

    this._eventType = routePoint.eventType;
    this._eventDestination = routePoint.eventDestination;

    this.rerender();
  }

  getTemplate() {
    return createRoutePointEditTemplate(this._routePoint, {
      selectedEventType: this._eventType,
      selectedEventDestination: this._eventDestination,
    }, this._isNewRoutePoint);
  }

  removeElement() {
    if (this._flatpickrStart) {
      this._flatpickrStart.destroy();
      this._flatpickrStart = null;
    }

    if (this._flatpickrEnd) {
      this._flatpickrEnd.destroy();
      this._flatpickrEnd = null;
    }

    super.removeElement();
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setResetHandler(this._resetHandler);
    if (!this._isNewRoutePoint) {
      this.setRollupButtonClickHandler(this._rollupButtonClickHandler);
      this.setFavoriteButtonClickHandler(this._favoriteButtonClickHandler);
    }
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);

    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();
    this._applyFlatpickr();
  }

  getData() {
    const form = this.getElement().querySelector(`.event--edit`);
    const formData = new FormData(form);
    formData.append(`event-favorite`, this._routePoint.eventIsFavorite);
    formData.append(`event-id`, this._routePoint.id);

    return parseFormData(formData, this._eventType);
  }

  setSubmitHandler(handler) {
    this.getElement().querySelector(`form`)
      .addEventListener(`submit`, handler);

    this._submitHandler = handler;
  }

  _applyFlatpickr() {
    if (this._flatpickrStart) {
      this._flatpickrStart.destroy();
      this._flatpickrStart = null;
    }

    if (this._flatpickrEnd) {
      this._flatpickrEnd.destroy();
      this._flatpickrEnd = null;
    }

    let startDate = this._routePoint.eventStartDate;

    const endDateElement = this.getElement().querySelector(`#event-end-time-1`);
    this._flatpickrEnd = flatpickr(endDateElement, {
      enableTime: true,
      altFormat: `d/m/y H:i`,
      altInput: true,
      allowInput: true,
      // eslint-disable-next-line
      time_24hr: true,
      defaultDate: this._routePoint.eventEndDate || `today`,
      onOpen() {
        this.set(`minDate`, startDate);
      }
    });

    const startDateElement = this.getElement().querySelector(`#event-start-time-1`);
    this._flatpickrStart = flatpickr(startDateElement, {
      enableTime: true,
      altFormat: `d/m/y H:i`,
      altInput: true,
      allowInput: true,
      // eslint-disable-next-line
      time_24hr: true,
      defaultDate: startDate || `today`,
      onChange(selectedDates, dateStr) {
        startDate = dateStr;
      },
    });
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.event__type-list`)
      .addEventListener(`click`, (evt) => {
        if (evt.target.type === `radio`) {
          const selectedEventType = eventTypes.find((eventType) => {
            return evt.target.value === eventType.name.toLowerCase();
          });
          this._eventType = selectedEventType;

          this.rerender();
        }
      });

    element.querySelector(`.event__input--destination`)
    .addEventListener(`change`, (evt) => {
      const selectedDestination = destinations.find((destination) => {
        return evt.target.value === destination.name;
      });
      if (selectedDestination) {
        this._eventDestination = selectedDestination;
      }

      this.rerender();
    });
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, handler);

    this._deleteButtonClickHandler = handler;
  }

  setResetHandler(handler) {
    this.getElement().querySelector(`form`)
      .addEventListener(`reset`, handler);

    this._resetHandler = handler;
  }

  setRollupButtonClickHandler(handler) {
    if (this._isNewRoutePoint) {
      return;
    }
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, handler);
    this._rollupButtonClickHandler = handler;
  }

  setFavoriteButtonClickHandler(handler) {
    if (this._isNewRoutePoint) {
      return;
    }
    this.getElement().querySelector(`.event__favorite-btn`)
      .addEventListener(`click`, handler);

    this._favoriteButtonClickHandler = handler;
  }
}
