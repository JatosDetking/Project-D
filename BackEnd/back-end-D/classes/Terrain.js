class Terrain {
  
  constructor(temperature, radiation, water, wind, price) {
    this.temperature = temperature;
    this.radiation = radiation;
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