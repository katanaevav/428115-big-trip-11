export default class Destination {
  constructor(data) {
    this.name = data.name;
    this.description = data.description;
    this.photos = data.pictures;
  }

  toRAW() {
    const rawData = {
      "description": this.description,
      "name": this.name,
      "pictures": this.photos,
    };

    return rawData;
  }

  static parseDestination(data) {
    return new Destination(data);
  }

  static parseDestinations(data) {
    return data.map(Destination.parseDestination);
  }
}
