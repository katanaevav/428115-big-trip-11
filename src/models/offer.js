const EventTypes = {
  TRANSFER: `Transfer`,
  ACTIVITY: `Activity`,
};

const ACTIVITIES = [`Check-in`, `Sightseeing`, `Restaurant`];

export default class Offer {
  constructor(data) {
    this.name = data.type;
    this.type = ACTIVITIES.some((it) => it.toLowerCase() === data.type) ? EventTypes.ACTIVITY : EventTypes.TRANSFER;
    this.offers = [];
    data.offers.forEach((offer) => {
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

  static parseOffer(data) {
    return new Offer(data);
  }

  static parseOffers(data) {
    return data.map(Offer.parseOffer);
  }
}
