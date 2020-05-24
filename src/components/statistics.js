import {uniqueItems, generateTextDuration} from "../utils/common.js";
import AbstractComponent from "./abstract-smart-component.js";
import {EventTypes} from "../const.js";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from "moment";

const BAR_HEIGHT = 55;

const getRoutePointsTypeList = (routePoints, eventTypes) => {
  return uniqueItems(routePoints.map((routePoint) => eventTypes.find((it) => it.name.toLowerCase() === routePoint.eventType.toLowerCase())));
};

const getMoney = (routePointsTypes, routePoints) => {
  return routePointsTypes.map((type) => routePoints.slice()
                                          .filter((it) => it.eventType.toLowerCase() === type.name.toLowerCase())
                                          .map((it) => it.eventCoast)
                                          .reduce((previousValue, currentValue) => previousValue + currentValue));
};

const getTransport = (routePointsTypes, routePoints) => {
  return routePointsTypes.map((type) => routePoints.slice()
                                          .filter((it) => it.eventType.toLowerCase() === type.name.toLowerCase()).length);
};

const getTimeSpendList = (routePointsTypes, routePoints) => {
  return routePointsTypes.map((type) => routePoints.slice()
                                          .filter((it) => it.eventType.toLowerCase() === type.name.toLowerCase())
                                          .map((it) => it.eventEndDate - it.eventStartDate)
                                          .reduce((previousValue, currentValue) => previousValue + currentValue));
};

const renderMoneyChart = (moneyCtx, routePointsList, moneyList) => {
  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: routePointsList,
      datasets: [{
        data: moneyList,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `€ ${val}`
        }
      },
      title: {
        display: true,
        text: `MONEY`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const renderTransportChart = (transportCtx, routePointsList, transportList) => {
  return new Chart(transportCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: routePointsList,
      datasets: [{
        data: transportList,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${val}x`
        }
      },
      title: {
        display: true,
        text: `TRANSPORT`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const renderTimeSpendChart = (timeSpendCtx, routePointsList, timeSpendList) => {
  return new Chart(timeSpendCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: routePointsList,
      datasets: [{
        data: timeSpendList,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => {
            const days = moment.duration(val).days();
            const hours = moment.duration(val).hours();
            const minutes = moment.duration(val).minutes();

            return generateTextDuration(days, hours, minutes);
          }
        }
      },
      title: {
        display: true,
        text: `TIME SPENT`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const createStatisticTemplate = () => {
  return (
    `<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>

    <div class="statistics__item statistics__item--money">
      <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--transport">
      <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--time-spend">
      <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
    </div>
  </section>`
  );
};

export default class Statistic extends AbstractComponent {
  constructor() {
    super();

    this._moneyChart = null;
    this._transportChart = null;
    this._timeSpendChart = null;

    this._routePoints = null;
    this._eventTypes = null;
    this._routePointsTypeList = null;
  }

  getTemplate() {
    return createStatisticTemplate();
  }

  getData(routePoints, eventTypes) {
    this._routePoints = routePoints;
    this._eventTypes = eventTypes;
  }

  show() {
    super.show();
    this._routePointsTypeList = getRoutePointsTypeList(this._routePoints, this._eventTypes);

    this.rerender();
  }

  recoveryListeners() {}

  rerender() {
    super.rerender();

    this._renderCharts();
  }

  _renderCharts() {
    const element = this.getElement();

    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    const transportCtx = element.querySelector(`.statistics__chart--transport`);
    const timeSpendCtx = element.querySelector(`.statistics__chart--time`);

    const allPoints = this._routePointsTypeList;
    const transportPoints = this._routePointsTypeList.slice()
                                               .filter((it) => it.type === EventTypes.TRANSFER);

    moneyCtx.height = BAR_HEIGHT * allPoints.length + 1;
    transportCtx.height = BAR_HEIGHT * transportPoints.length + 1;
    timeSpendCtx.height = BAR_HEIGHT * allPoints.length + 1;

    this._resetCharts();

    this._moneyChart = renderMoneyChart(moneyCtx,
        allPoints.map((it) => it.name),
        getMoney(allPoints, this._routePoints));


    this._transportChart = renderTransportChart(transportCtx,
        transportPoints.map((it) => it.name),
        getTransport(transportPoints, this._routePoints));

    this._timeSpendChart = renderTimeSpendChart(timeSpendCtx,
        allPoints.map((it) => it.name),
        getTimeSpendList(allPoints, this._routePoints));
  }

  _resetCharts() {
    if (this._moneyChart) {
      this._moneyChart.destroy();
      this._moneyChart = null;
    }

    if (this._transportChart) {
      this._transportChart.destroy();
      this._transportChart = null;
    }

    if (this.timeSpendCtx) {
      this.timeSpendCtx.destroy();
      this.timeSpendCtx = null;
    }
  }
}
