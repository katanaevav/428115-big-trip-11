import {EventTypes} from "../const.js";

const ACTIVITIES = [`Check-in`, `Sightseeing`, `Restaurant`];

export default class Offer {
  constructor(eventType) {
    this.name = eventType.type;
    this.type = ACTIVITIES.some((it) => it.toLowerCase() === eventType.type) ? EventTypes.ACTIVITY : EventTypes.TRANSFER;
    this.offers = [];
    eventType.offers.forEach((offer) => {
      this.offers.push({
        name: offer.title,
        key: `event-offer-${offer.title.toLowerCase().replace(/\s/g, `-`)}`,
        coast: offer.price,
      });
    });
  }

  toRAW() {
    const eventOffers = this.offers.map((offer) => ({
      title: offer.name,
      price: offer.coast,
    }));

    return {
      type: this.name,
      offers: eventOffers,
    };
  }

  static parseOffer(eventType) {
    return new Offer(eventType);
  }

  static parseOffers(eventTypes) {
    return eventTypes.map(Offer.parseOffer);
  }
}
