import {setDateToHTMLFormat, firstButtonUpCase} from "../utils/common.js";

export default class Point {
  constructor(routePoint) {
    this.id = routePoint.id;
    this.eventStartDate = Date.parse(routePoint.date_from);
    this.eventEndDate = Date.parse(routePoint.date_to);
    this.eventCoast = parseInt(routePoint.base_price, 10);

    this.eventOffers = routePoint.offers.map((offer) => ({
      name: offer.title,
      key: `event-offer-${offer.title.toLowerCase().replace(/\s/g, `-`)}`,
      coast: parseInt(offer.price, 10),
    }));

    this.eventType = firstButtonUpCase(routePoint.type);

    this.eventDestination = {};
    this.eventDestination.name = routePoint.destination.name;
    this.eventDestination.description = routePoint.destination.description;
    this.eventDestination.photos = routePoint.destination.pictures;

    this.eventIsFavorite = routePoint.is_favorite;
  }

  toRAW() {
    const offers = this.eventOffers.map((offer) => ({
      title: offer.name,
      price: offer.coast,
    }));

    const destination = {};
    destination.description = this.eventDestination.description;
    destination.name = this.eventDestination.name;
    destination.pictures = this.eventDestination.photos;

    const rawData = {
      "base_price": parseInt(this.eventCoast, 10),
      "date_from": setDateToHTMLFormat(this.eventStartDate),
      "date_to": setDateToHTMLFormat(this.eventEndDate),
      "destination": destination,
      "id": this.id,
      "is_favorite": this.eventIsFavorite,
      "offers": offers,
      "type": this.eventType.toLowerCase(),
    };

    return rawData;
  }

  static parsePoint(routePoint) {
    return new Point(routePoint);
  }

  static parsePoints(routePoints) {
    return routePoints.map(Point.parsePoint);
  }

  static clone(routePoint) {
    return new Point(routePoint.toRAW());
  }
}
