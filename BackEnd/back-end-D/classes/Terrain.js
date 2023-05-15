class Terrain {

    constructor(temperatureRadiation, water, wind, price) {
      this.temperatureRadiation = temperatureRadiation;
      this.water = water;
      this.wind = wind;
      this.price = price;
      this.optimal = 0;
      this.optimalCost = 0;
      this.optimalIndex = 0;
      this.probabilitiesArr = [];
      this.efficiencyBenefitArr = [];
    }
  }
  module.exports = Terrain;