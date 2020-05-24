export default class Destination {
  constructor(destination) {
    this.name = destination.name;
    this.description = destination.description;
    this.photos = destination.pictures;
  }

  toRAW() {
    return {
      description: this.description,
      name: this.name,
      pictures: this.photos,
    };
  }

  static parseDestination(destination) {
    return new Destination(destination);
  }

  static parseDestinations(destinations) {
    return destinations.map(Destination.parseDestination);
  }
}
