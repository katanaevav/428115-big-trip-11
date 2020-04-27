import AbstractComponent from "./abstract-component.js";
import {setDateToHTMLFormat, setDateToMonthDDFormat} from "../utils/common.js";

const createDayInfoTemplate = (dayNumber, date, hideDates) => {
  let info = `<span class="day__counter">${dayNumber}</span>
    <time class="day__date" datetime="${setDateToHTMLFormat(date)}">${setDateToMonthDDFormat(date)}</time>`;
  if (hideDates) {
    info = ``;
  }
  return info;
};

const createDayTemplate = (dayNumber, date, hideDates) => {
  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        ${createDayInfoTemplate(dayNumber, date, hideDates)}
      </div>
      <ul class="trip-events__list">
      </ul>
    </li>`
  );
};

export default class Day extends AbstractComponent {
  constructor(dayNumber, date, hideDates = false) {
    super();

    this._dayNumber = dayNumber;
    this._date = date;
    this._hideDates = hideDates;
  }

  getTemplate() {
    return createDayTemplate(this._dayNumber, this._date, this._hideDates);
  }
}
