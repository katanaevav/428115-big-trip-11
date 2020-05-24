import AbstractComponent from "./abstract-component.js";
import {MenuElement} from "../const.js";

const LINK_TAG = `A`;

const createMenuTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn trip-tabs__btn--active" id="trip-tabs__table" href="#">Table</a>
      <a class="trip-tabs__btn" id="trip-tabs__stats" href="#">Stats</a>
    </nav>`
  );
};

export default class Menu extends AbstractComponent {
  getTemplate() {
    return createMenuTemplate();
  }

  setActiveItem(item) {
    this.getElement().querySelectorAll(`${MenuElement.ALL}`).forEach((it) => {
      if (it.classList.contains(`${MenuElement.ACTIVE}`)) {
        it.classList.remove(`${MenuElement.ACTIVE}`);
      }
    });

    this.getElement().querySelector(`#${item}`).classList.add(`${MenuElement.ACTIVE}`);
  }

  setOnClick(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== LINK_TAG) {
        return;
      }

      const menuItem = evt.target.id;
      handler(menuItem);
    });
  }
}
