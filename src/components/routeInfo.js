import {uniqueItems, setDateToMonthDDFormat} from "../utils/common.js";
import AbstractComponent from "./abstractComponent.js";

const createRouteInfoTemplate = (routePoints) => {
  const tripTitles = uniqueItems(routePoints.map((routePoint) => {
    return routePoint.eventDestination;
  }));

  const lastTitleItem = tripTitles.length - 1;
  if (tripTitles.length > 3) {
    tripTitles.splice(1, lastTitleItem - 1, `...`);
  }

  const tripTitle = tripTitles.join(` &nbsp;&mdash;&nbsp; `);

  const lastDatesItem = routePoints.length - 1;
  const tripDates = routePoints
    .slice()
    .sort((a, b) => a.eventStartDate - b.eventStartDate)
    .map((date) => setDateToMonthDDFormat(date.eventStartDate));
  tripDates.splice(1, lastDatesItem - 1);
  const tripDate = tripDates.join(` &nbsp;&mdash;&nbsp; `);

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
  constructor(routePoints) {
    super();

    this._routePoints = routePoints;
  }

  getTemplate() {
    return createRouteInfoTemplate(this._routePoints);
  }
}
