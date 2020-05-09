import AbstractComponent from "./abstract-component.js";

const calculateCoast = (routePoints) => {
  let coast = 0;

  routePoints.forEach((routePoint) => {
    coast += parseInt(routePoint.eventCoast, 10);
    routePoint.eventOffers
        .forEach((eventOffer) => {
          coast += parseInt(eventOffer.coast, 10);
        });
  });
  return coast;
};

const createRouteCostTemplate = (routePoints = []) => {
  const coast = calculateCoast(routePoints);
  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${coast}</span>
    </p>`
  );
};

export default class RouteCost extends AbstractComponent {
  getTemplate() {
    return createRouteCostTemplate();
  }

  calculate(routePoints) {
    this.getElement().querySelector(`.trip-info__cost-value`).textContent = calculateCoast(routePoints);
  }
}
