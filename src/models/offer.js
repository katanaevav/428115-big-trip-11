const EventTypes = {
  TRANSFER: `Transfer`,
  ACTIVITY: `Activity`,
};

const ACTIVITIES = [`Check-in`, `Sightseeing`, `Restaurant`];

export default class Offer {
  constructor(data) {
    this.name = data[`type`];
    this.type = ACTIVITIES.findIndex((it) => it.toLowerCase() === data[`type`]) < 0 ? EventTypes.TRANSFER : EventTypes.ACTIVITY;
    this.offers = [];
    data[`offers`].forEach((offer) => {
      this.offers.push({
        name: offer.title,
        key: `event-offer-${offer.title.toLowerCase().replace(/\s/g, `-`)}`,
        coast: offer.price,
      });
    });
  }

  static parseOffer(data) {
    return new Offer(data);
  }

  static parseOffers(data) {
    return data.map(Offer.parseOffer);
  }
}
