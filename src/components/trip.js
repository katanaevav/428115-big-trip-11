import AbstractComponent from "./abstract-component.js";

const createTripTemplate = () => {
  return (
    `<section class="trip-events">
      <h2 class="visually-hidden">Trip events</h2>

      <!-- Сортировка -->

      <!-- Контент -->
  </section>`
  );
};

export default class Trip extends AbstractComponent {
  getTemplate() {
    return createTripTemplate();
  }
}
