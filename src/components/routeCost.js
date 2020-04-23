import AbstractComponent from "./abstractComponent.js";

const calculateCoast = (routePoints) => {
  let coast = 0;
  routePoints.forEach((routePoint) => {
    coast += routePoint.eventCoast;
    routePoint.eventOffers
        .slice()
        .filter((eventOffer) => eventOffer.selected)
        .forEach((eventOffer) => {
          coast += eventOffer.coast;
        });
  });
  return coast;
};

const createRouteCostTemplate = (routePoints) => {
  const coast = calculateCoast(routePoints);
  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${coast}</span>
    </p>`
  );
};

export default class RouteCost extends AbstractComponent {
  constructor(routePoints) {
    super();

    this._routePoints = routePoints;
  }

  getTemplate() {
    return createRouteCostTemplate(this._routePoints);
  }
}
