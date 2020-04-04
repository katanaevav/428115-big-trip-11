const ROUTE_POINTS_COUNT = 3;

import {createRouteInfoTemplate} from "./components/routeInfo.js";
import {createRouteCostTemplate} from "./components/routeCost.js";
import {createMenuTemplate} from "./components/menu.js";
import {createFilterTemplate} from "./components/filter.js";
import {createSortingTemplate} from "./components/sorting.js";
import {createRoutePointEditTemplate} from "./components/routePointEdit.js";
import {createRoutePointTemplate} from "./components/routePoint.js";

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
render(tripControls, createFilterTemplate());

const tripEvents = document.querySelector(`.trip-events`);
const tripSorting = tripEvents.querySelector(`h2`);
render(tripSorting, createSortingTemplate(), `afterend`);

render(tripEvents, createRoutePointEditTemplate());

for (let i = 0; i < ROUTE_POINTS_COUNT; i++) {
  render(tripEvents, createRoutePointTemplate());
}
