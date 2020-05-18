// routePoints

export default class Point {
  constructor(data) {
    console.log(data);
    this.id = data[`id`];
    this.eventStartDate = Date.parse(data[`date_from`]);
    this.eventEndDate = Date.parse(data[`date_to`]);
    this.eventCoast = data[`base_price`];

    this.eventOffers = [];
    data[`offers`].forEach((offer) => {
      this.eventOffers.push({
        name: offer.title,
        key: `event-offer-${offer.title.toLowerCase().replace(/\s/g, `-`)}`,
        coast: offer.price,
      });
    });

    this.eventType = data[`type`][0].toUpperCase() + data[`type`].slice(1);

    this.eventDestination = {};
    this.eventDestination.name = data[`destination`].name;
    this.eventDestination.description = data[`destination`].description;
    this.eventDestination.photos = data[`destination`].pictures;

    this.eventIsFavorite = data[`is_favorite`];
  }

  toRAW() {
    const offers = [];
    this.eventOffers.forEach((offer) => {
      offers.push({
        title: offer.title,
        price: offer.price,
      });
    });

    const destination = {};
    destination.description = this.eventDestination.name;
    destination.name = this.eventDestination.description;
    destination.pictures = this.eventDestination.photos;

    return {
      "id": this.id,
      "date_from": this.eventStartDate,
      "date_to": this.eventEndDate,
      "base_price": this.eventCoast,
      "offers": offers,
      "is_favorite": this.eventIsFavorite,
      "type": this.eventType.toLowerCase(),
      "destination": destination,
    };
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
