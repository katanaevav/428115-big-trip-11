import AbstractComponent from "./abstract-component.js";

const createNoRoutePointsTemplate = () => {
  return (
    `<p class="trip-events__msg">Click New Event to create your first point</p>`
  );
};

export default class NoRoutePoints extends AbstractComponent {
  getTemplate() {
    return createNoRoutePointsTemplate();
  }

  removeElement() {
    super.removeElement();
  }
}
