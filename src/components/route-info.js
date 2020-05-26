import {getUniqueItems, setDateToMonthDDFormat} from "../utils/common.js";
import AbstractComponent from "./abstract-component.js";

const generateTripTitles = (routePoints) => {
  const tripTitles = getUniqueItems(routePoints.map((routePoint) => {
    return routePoint.eventDestination.name;
  }));

  const lastTitleItem = tripTitles.length - 1;
  if (tripTitles.length > 3) {
    tripTitles.splice(1, lastTitleItem - 1, `...`);
  }

  return tripTitles.join(`  —  `);
};

const generateTripDates = (routePoints) => {
  const lastDatesItem = routePoints.length - 1;
  const tripDates = routePoints
    .slice()
    .sort((a, b) => a.eventStartDate - b.eventStartDate)
    .map((date) => setDateToMonthDDFormat(date.eventStartDate));
  tripDates.splice(1, lastDatesItem - 1);

  return tripDates.join(` — `);
};

const createRouteInfoTemplate = (routePoints = []) => {
  const tripTitle = generateTripTitles(routePoints);
  const tripDate = generateTripDates(routePoints);

  return (
    `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${tripTitle}</h1>

      <p class="trip-info__dates">${tripDate}</p>
    </div>
  </section>`
  );
};

export default class RouteInfo extends AbstractComponent {
  getTemplate() {
    return createRouteInfoTemplate();
  }

  generate(routePoints) {
    this.getElement().querySelector(`.trip-info__title`).textContent = generateTripTitles(routePoints);
    this.getElement().querySelector(`.trip-info__dates`).textContent = generateTripDates(routePoints);
  }
}
