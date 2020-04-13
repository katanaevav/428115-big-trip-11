const ROUTE_POINTS_COUNT = 15;

import {createRouteInfoTemplate} from "./components/routeInfo.js";
import {createRouteCostTemplate} from "./components/routeCost.js";
import {createMenuTemplate} from "./components/menu.js";
import {createFilterTemplate} from "./components/filter.js";
import {createSortingTemplate} from "./components/sorting.js";
import {createRoutePointEditTemplate} from "./components/routePointEdit.js";
import {createRoutePointTemplate} from "./components/routePoint.js";
import {createDaysTemplate} from "./components/days.js";
import {createDayTemplate} from "./components/day.js";
import {filterNames} from "./mock/filter.js";
import {getDatesDuration} from "./utils.js";
import {generateRoutePoints} from "./mock/routePoint.js";

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const tripMainElement = document.querySelector(`.trip-main`);
render(tripMainElement, createRouteInfoTemplate(), `afterbegin`);

const tripInfo = tripMainElement.querySelector(`.trip-info__main`);
render(tripInfo, createRouteCostTemplate(), `afterend`);

const tripControls = tripMainElement.querySelector(`.trip-controls`);
const tripMenu = tripControls.querySelector(`h2`);
render(tripMenu, createMenuTemplate(), `afterend`);
render(tripControls, createFilterTemplate(filterNames));

const tripEvents = document.querySelector(`.trip-events`);
const tripSorting = tripEvents.querySelector(`h2`);
render(tripSorting, createSortingTemplate(), `afterend`);

render(tripEvents, createDaysTemplate());

const routePoints = generateRoutePoints(ROUTE_POINTS_COUNT).sort((a, b) => a.eventStartDate - b.eventStartDate);
const days = document.querySelector(`.trip-days`);

let dayNumber = 0;
render(days, createDayTemplate(dayNumber + 1, routePoints[0].eventStartDate));
let dayEventsList = days.querySelector(`.trip-days__item:last-child .trip-events__list`);
render(dayEventsList, createRoutePointEditTemplate(routePoints[0]));

routePoints.forEach((routePoint, index) => {
  if (index > 0) {
    if (getDatesDuration(routePoints[0].eventStartDate, routePoint.eventStartDate).daysBetween > dayNumber) {
      dayNumber = getDatesDuration(routePoints[0].eventStartDate, routePoint.eventStartDate).daysBetween;
      render(days, createDayTemplate(dayNumber + 1, routePoint.eventStartDate));
    }
    dayEventsList = days.querySelector(`.trip-days__item:last-child .trip-events__list`);
    render(dayEventsList, createRoutePointTemplate(routePoint));
  }
});
