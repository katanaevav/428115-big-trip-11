import AbstractComponent from "./abstractComponent.js";

const createDaysTemplate = () => {
  return (
    `<ul class="trip-days">
    </ul>`
  );
};

export default class Days extends AbstractComponent {
  getTemplate() {
    return createDaysTemplate();
  }
}
