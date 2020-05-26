import moment from "moment";
import {EventTypes} from "../const.js";

const DAYS = 30;
const EVENT_TYPE_TRANSFER = EventTypes.TRANSFER;
const PRETEXT_TRANSFER = `to`;
const PRETEXT_ACTIVITY = `in`;

const setZeroAtStart = (number) => {
  const str = number.toString();
  return str.length < 2 ? `0${str}` : str;
};

export const firstButtonUpCase = (text) => {
  return text[0].toUpperCase() + text.slice(1);
};

export const isFutureEvent = (eventStartDate) => {
  return eventStartDate > Date.now();
};

export const isPastEvent = (eventEndDate) => {
  return eventEndDate < Date.now();
};

export const pretextFromEventType = (eventType) => {
  return eventType === EVENT_TYPE_TRANSFER ? PRETEXT_TRANSFER : PRETEXT_ACTIVITY;
};

export const uniqueItems = (arr) => {
  return Array.from(new Set(arr));
};

export const getRandomBool = () => {
  return Math.random() >= 0.5;
};

export const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};

export const getRandomNumbers = function (minNumber, maxNumber, count) {
  const numbers = [];
  let number;
  while (numbers.length < count) {
    number = Math.floor((minNumber + Math.random()) * maxNumber);
    if (numbers.indexOf(number) === -1) {
      numbers.push(number);
    }
  }
  return numbers;
};

export const setDateToHTMLFormat = (dateInInt) => {
  return moment(dateInInt).format(`YYYY-MM-DDTHH:mm`);
};

export const setDateToHHMMFormat = (dateInInt) => {
  return moment(dateInInt).format(`HH:mm`);
};

export const setDateToMonthDDFormat = (dateInInt) => {
  return moment(dateInInt).format(`MMM DD`);
};

export const generateTextDuration = (days, hours, minutes) => {
  return `${days > 0 ? `${setZeroAtStart(days)}D` : ``} ${hours > 0 ? `${setZeroAtStart(hours)}H` : ``} ${minutes > 0 ? `${setZeroAtStart(minutes)}M` : ``}`;
};

export const getDatesDuration = (date1InInt, date2InInt) => {
  const startDate = moment(date1InInt);
  const endDate = moment(date2InInt);

  const days = moment.duration(endDate.diff(startDate)).days();
  const hours = moment.duration(endDate.diff(startDate)).hours();
  const minutes = moment.duration(endDate.diff(startDate)).minutes();

  const daysBetween = (((endDate.month() + 1) * DAYS) + endDate.date()) - (((startDate.month() + 1) * DAYS) + startDate.date());

  return ({
    duration: generateTextDuration(days, hours, minutes),
    daysBetween,
  });
};
