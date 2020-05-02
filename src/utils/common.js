import {MONTH_NAMES} from "../const.js";

const MILLISECONDS_IN_SECUND = 1000;
const SECUNDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;
const DAYS = 30;
const EVENT_TYPE_TRANSFER = `Transfer`;
const PRETEXT_TRANSFER = `to`;
const PRETEXT_ACTIVITY = `in`;

const setZeroAtStart = (number) => {
  const str = number.toString();
  return str.length < 2 ? `0${str}` : str;
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
  let array = [];
  let number;
  while (array.length < count) {
    number = Math.floor((minNumber + Math.random()) * maxNumber);
    if (array.indexOf(number) === -1) {
      array.push(number);
    }
  }
  return array;
};

export const setDateToHTMLFormat = (dateInInt) => {
  const date = new Date(dateInInt);
  return (
    `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}T${date.getHours()}:${date.getMinutes()}`
  );
};

export const setDateToHHMMFormat = (dateInInt) => {
  const date = new Date(dateInInt);
  return (
    `${setZeroAtStart(date.getHours())}:${setZeroAtStart(date.getMinutes())}`
  );
};

export const setDateToMonthDDFormat = (dateInInt) => {
  const date = new Date(dateInInt);
  return (
    `${MONTH_NAMES[date.getMonth()]} ${setZeroAtStart(date.getDate())}`
  );
};

export const setDateToDateTimeFormat = (dateInInt) => {
  const date = new Date(dateInInt);
  const shortYear = `${date.getFullYear().toString().charAt(2)}${date.getFullYear().toString().charAt(3)}`;
  return (
    `${setZeroAtStart(date.getDate())}/${setZeroAtStart(date.getMonth() + 1)}/${shortYear} ${setZeroAtStart(date.getHours())}:${setZeroAtStart(date.getMinutes())}`
  );
};

export const getDatesDuration = (date1InInt, date2InInt) => {
  const inMinutes = (date2InInt - date1InInt) / MILLISECONDS_IN_SECUND / SECUNDS_IN_MINUTE;

  const days = Math.floor(inMinutes / MINUTES_IN_HOUR / HOURS_IN_DAY);
  const hours = Math.floor((inMinutes / 60) - (Math.floor(inMinutes / MINUTES_IN_HOUR / HOURS_IN_DAY) * HOURS_IN_DAY));
  const minutes = Math.ceil(inMinutes - (Math.floor(inMinutes / MINUTES_IN_HOUR) * MINUTES_IN_HOUR));

  let duration = ``;

  if (days < 1) {
    if (hours < 1) {
      duration = `${setZeroAtStart(minutes)}M`;
    } else {
      duration = `${setZeroAtStart(hours)}H ${setZeroAtStart(minutes)}M`;
    }
  } else {
    duration = `${setZeroAtStart(days)}D ${setZeroAtStart(hours)}H ${setZeroAtStart(minutes)}M`;
  }

  const date1 = new Date(date1InInt);
  const date2 = new Date(date2InInt);

  return ({
    duration,
    daysBetween: (((date2.getMonth() + 1) * DAYS) + date2.getDate()) - (((date1.getMonth() + 1) * DAYS) + date1.getDate()),
    days,
    hours,
    minutes,
  });
};
