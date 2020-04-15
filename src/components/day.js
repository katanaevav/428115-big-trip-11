import {createElement} from "../utils.js";

import {setDateToHTMLFormat, setDateToMonthDDFormat} from "../utils.js";

const createDayTemplate = (dayNumber, date) => {
  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${dayNumber}</span>
        <time class="day__date" datetime="${setDateToHTMLFormat(date)}">${setDateToMonthDDFormat(date)}</time>
      </div>
      <ul class="trip-events__list">
      </ul>
    </li>`
  );
};

export default class Day {
  constructor(dayNumber, date) {
    this._dayNumber = dayNumber;
    this._date = date;
    this._element = null;
  }

  getTemplate() {
    return createDayTemplate(this._dayNumber, this._date);
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
