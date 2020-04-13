import {setDateToHTMLFormat, setDateToMonthDDFormat} from "../utils.js";

export const createDayTemplate = (dayNumber, date) => {
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
