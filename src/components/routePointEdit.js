import {uniqueItems, setDateToDateTimeFormat, createElement} from "../utils.js";
import {eventTypes} from "../const.js";

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

const generateOfferTemplate = (offer) => {
  const {name, key, coast, selected} = offer;
  const checked = selected ? `checked` : ``;

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

const generatePictureTemplate = (picture) => {
  return (
    `<img class="event__photo" src="${picture}" alt="Event photo">`
  );
};

const createRoutePointEditTemplate = (routePoint) => {
  const {eventType, eventDestination, eventStartDate, eventEndDate, eventCoast, eventOffers, eventDescription, eventPhotos} = routePoint;

  const eventName = eventType.name;
  const eventAction = eventType.type === `Transfer` ? `to` : `in`;

  const offersTemplate = eventOffers.map((it) => generateOfferTemplate(it)).join(`\n`);
  const picturesTemplate = eventPhotos.map((it) => generatePictureTemplate(it)).join(`\n`);

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
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${eventDestination}" list="destination-list-1">
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
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${setDateToDateTimeFormat(eventStartDate)}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${setDateToDateTimeFormat(eventEndDate)}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${eventCoast}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Cancel</button>
        </header>
        <section class="event__details">
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

            <div class="event__available-offers">
              ${offersTemplate}
            </div>
          </section>

          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${eventDescription}</p>

            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${picturesTemplate}
              </div>
            </div>
          </section>
        </section>
      </form>
    </li>`
  );
};

export default class RoutePoint {
  constructor(routePoint) {
    this._routePoint = routePoint;
    this._element = null;
  }

  getTemplate() {
    return createRoutePointEditTemplate(this._routePoint);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
