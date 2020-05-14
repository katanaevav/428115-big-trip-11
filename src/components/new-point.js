import AbstractComponent from "./abstract-component.js";

const createNewPointTemplate = () => {
  return (
    `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>`
  );
};

export default class NewPoint extends AbstractComponent {
  getTemplate() {
    return createNewPointTemplate();
  }

  setOnClick(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `BUTTON`) {
        return;
      }

      handler();
    });
  }
}
