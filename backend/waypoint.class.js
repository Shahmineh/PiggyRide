const request = require('request-promise-native');
const Schema = require('mongoose').Schema;
const ModelAndRoutes = require('./model-and-routes.class');

module.exports = class Waypoint extends ModelAndRoutes {
  constructor (app, obj) {
    super(app);
    Object.assign(this, obj);
    let leg = this.gway.routes[0].legs[0];
    this.startAddress = leg.start_address;
    this.endAdress = leg.end_address;
    this.duration = leg.duration.value;
    this.durationMinutes = Math.round(this.duration / 60);
    this.endTime = new Date(this.startTime.getTime() + this.duration * 1000);
    this.distance = leg.distance.value;
    this.speed = Math.round(this.distance / 1000 / (this.durationMinutes / 60));
    this.positions = [
      Object.assign(
        {
          time: this.startTime
        },
        leg.start_location,
        {
          text: 'Du är på ' + this.startAddress
        }
      )
    ];
    let time = this.startTime;
    for (let step of leg.steps) {
      time = new Date(time.getTime() + step.duration.value * 1000);
      this.positions.push({
        time: time,
        lat: step.end_location.lat,
        lng: step.end_location.lng,
        text: step.html_instructions
      });
    }
    // this.steps = leg.steps;
    delete this.gway;
  }

  static get schema () {
    return {
      from: String,
      to: String,
      startTime: Date,
      startAddress: String,
      endAdress: String,
      duration: Number,
      durationMinutes: Number,
      endTime: Date,
      distance: Number,
      speed: Number,
      positions: [
        {
          time: Date,
          lat: Number,
          lng: Number,
          text: String
        }
      ]
    };
  }

  get hqPos () {
    // Nordenskiöldsgatan 13, Malmö
    return {
      lat: 55.6108096,
      lng: 12.9946562
    };
  }

  async position (timeString) {
    let time = new Date(timeString),
      timeDiff = Math.abs(time - this.positions[0].time),
      currPos = {};

    for (let position of this.positions) {
      let currDiff = Math.abs(time - position.time);
      if (currDiff <= timeDiff) {
        timeDiff = currDiff;
        currPos = position;
      }
    }
    return currPos;
  }

  static async create (app, obj) {

    let url = 'https://maps.googleapis.com/maps/api/directions/json';

    let params = {
      origin: obj.from + (obj.from.includes('Malmö') ? '' : ' Malmö'),
      destination: obj.to + (obj.to.includes('Malmö') ? '' : ' Malmö'),
      mode: obj.how || 'walking',
      key: 'AIzaSyBrE71qz1iEQgNnM3fbzIXB5pmRoB9rWiQ',
      language: 'sv'
    };

    for (let param in params) {
      url += url.includes('?') ? '&' : '?';
      url += param + '=' + encodeURIComponent(params[param]);
    }

    obj.gway = JSON.parse(await request(url));
    return new Waypoint(app, obj);
  }
};
