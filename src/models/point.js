import {setDateToHTMLFormat, firstButtonUpCase} from "../utils/common.js";

export default class Point {
  constructor(data) {
    this.id = data.id;
    this.eventStartDate = Date.parse(data.date_from);
    this.eventEndDate = Date.parse(data.date_to);
    this.eventCoast = parseInt(data.base_price, 10);

    this.eventOffers = [];
    data.offers.forEach((offer) => {
      this.eventOffers.push({
        name: offer.title,
        key: `event-offer-${offer.title.toLowerCase().replace(/\s/g, `-`)}`,
        coast: parseInt(offer.price, 10),
      });
    });

    this.eventType = firstButtonUpCase(data.type);

    this.eventDestination = {};
    this.eventDestination.name = data.destination.name;
    this.eventDestination.description = data.destination.description;
    this.eventDestination.photos = data.destination.pictures;

    this.eventIsFavorite = data.is_favorite;
  }

  toRAW() {
    const offers = [];
    this.eventOffers.map((offer) => {
      offers.push({
        title: offer.name,
        price: offer.coast,
      });
    });

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

  static parsePoint(data) {
    return new Point(data);
  }

  static parsePoints(data) {
    return data.map(Point.parsePoint);
  }

  static clone(data) {
    return new Point(data.toRAW());
  }
}
