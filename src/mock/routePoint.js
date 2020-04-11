import {getRandomInt, getRandomBool, getRandomNumbers} from "../utils.js";
import {eventTypes} from "../const.js";

const MINUTE = (1000 * 60);
const HOUR = (1000 * 60 * 60);
const DAY = (1000 * 60 * 60 * 24);
const DAYS = 10;
const HOURS = 40;
const MINUTES = 70;
const MAX_COAST = 1000;
const MAX_PHOTOS_COUNT = 4;
const MAX_DESCRIPTIONS = 5;
const MAX_ROUTE_OPTIONS = 5;

const destinations = [`Amsterdam`, `Geneva`, `Chamonix`, `Saint Petersburg`];

const generateCoast = () => {
  return getRandomInt(MAX_COAST);
};

const generateRouteOptions = () => {
  const routeOptions = [
    {
      name: `Add luggage`,
      key: `luggage`,
      coast: generateCoast(),
      selected: getRandomBool(),
    },
    {
      name: `Switch to comfort`,
      key: `comfort`,
      coast: generateCoast(),
      selected: getRandomBool(),
    },
    {
      name: `Add meal`,
      key: `meal`,
      coast: generateCoast(),
      selected: getRandomBool(),
    },
    {
      name: `Choose seats`,
      key: `seats`,
      coast: generateCoast(),
      selected: getRandomBool(),
    },
    {
      name: `Travel by train`,
      key: `train`,
      coast: generateCoast(),
      selected: getRandomBool(),
    },
  ];

  const options = getRandomNumbers(0, routeOptions.length, getRandomInt(MAX_ROUTE_OPTIONS));
  return options.map((it) => routeOptions[it]);
};

const generateDescription = () => {
  const textDescriptions = [
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    `Cras aliquet varius magna, non porta ligula feugiat eget.`,
    `Fusce tristique felis at fermentum pharetra.`,
    `Aliquam id orci ut lectus varius viverra.`,
    `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
    `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
    `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
    `Sed sed nisi sed augue convallis suscipit in sed felis.`,
    `Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.`,
    `In rutrum ac purus sit amet tempus.`,
  ];

  const randomText = getRandomNumbers(0, textDescriptions.length, getRandomInt(MAX_DESCRIPTIONS) + 1);
  return randomText.map((it) => textDescriptions[it]);
};

const generatePhoto = () => `http://picsum.photos/248/152?r=${Math.random()}`;

const generatePhotos = (count) => {
  return new Array(count)
   .fill(``)
   .map(generatePhoto);
};

export const generateRoutePointStructure = () => {
  const startDate = Date.now() + (getRandomInt(DAYS) * DAY) + (getRandomInt(HOURS) * HOUR) + (getRandomInt(MINUTES) * MINUTE);
  return ({
    eventType: eventTypes[getRandomInt(eventTypes.length)],
    eventDestination: destinations[getRandomInt(destinations.length)],
    eventStartDate: startDate,
    eventEndDate: startDate + (getRandomInt(HOURS) * HOUR) + (getRandomInt(MINUTES) * MINUTE),
    eventCoast: generateCoast(),
    eventOffers: generateRouteOptions(),
    eventDescription: generateDescription(),
    eventPhotos: generatePhotos(getRandomInt(MAX_PHOTOS_COUNT) + 1)
  });
};

export const generateRoutePoints = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateRoutePointStructure);
};
