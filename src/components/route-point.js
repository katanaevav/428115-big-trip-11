import {setDateToHTMLFormat, setDateToHHMMFormat, getDatesDuration, pretextFromEventType} from "../utils/common.js";
import AbstractComponent from "./abstract-component.js";

const MAX_OFFERS = 3;

const generateOfferTemplate = (offer) => {
  const name = offer.name;
  const coast = offer.coast;

  return (
    `<li class="event__offer">
      <span class="event__offer-title">${name}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${coast}</span>
    </li>`
  );
};

const createRoutePointTemplate = (routePoint, eventTypes) => {
  const {eventStartDate, eventEndDate, eventCoast, eventOffers, eventType, eventDestination} = routePoint;

  // const eventName = eventType.name;
  const eventName = eventType;

  const eventTypeIndex = eventTypes.findIndex((it) => it.name.toLowerCase() === eventType.toLowerCase());
  const eventAction = pretextFromEventType(eventTypes[eventTypeIndex].type);
  // const eventAction = pretextFromEventType(eventType.type);

  const destination = eventDestination.name;

  const {duration} = getDatesDuration(eventStartDate, eventEndDate);

  const offersTemplate = eventOffers.map((it, i) => i < MAX_OFFERS ? generateOfferTemplate(it) : ``).join(`\n`);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${eventName.toLowerCase()}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${eventName} ${eventAction} ${destination}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${setDateToHTMLFormat(eventStartDate)}">${setDateToHHMMFormat(eventStartDate)}</time>
            &mdash;
            <time class="event__end-time" datetime="${setDateToHTMLFormat(eventEndDate)}">${setDateToHHMMFormat(eventEndDate)}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${eventCoast}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offersTemplate}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class RoutePoint extends AbstractComponent {
  constructor(routePoint, eventTypes) {
    super();

    this._routePoint = routePoint;
    this._eventTypes = eventTypes;
  }

  getTemplate() {
    return createRoutePointTemplate(this._routePoint, this._eventTypes);
  }

  setRollupButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, handler);
  }
}
