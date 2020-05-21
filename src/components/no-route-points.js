import AbstractComponent from "./abstract-component.js";

const Texts = {
  LOADING: `Loading...`,
  NO_ROUTEPOINTS: `Click New Event to create your first point`,
  ERROR: `Error loading points`
};

const createNoRoutePointsTemplate = () => {
  return (
    `<p class="trip-events__msg">${Texts.NO_ROUTEPOINTS}</p>`
  );
};

export default class NoRoutePoints extends AbstractComponent {
  getTemplate() {
    return createNoRoutePointsTemplate();
  }

  removeElement() {
    super.removeElement();
  }

  setLoading() {
    this.getElement().innerHTML = Texts.LOADING;
  }

  setError() {
    this.getElement().innerHTML = Texts.ERROR;
  }
}
