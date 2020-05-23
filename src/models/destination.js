export default class Destination {
  constructor(data) {
    this.name = data.name;
    this.description = data.description;
    this.photos = data.pictures;
  }

  toRAW() {
    return {
      description: this.description,
      name: this.name,
      pictures: this.photos,
    };
  }

  static parseDestination(data) {
    return new Destination(data);
  }

  static parseDestinations(data) {
    return data.map(Destination.parseDestination);
  }
}
