const Methods = require('./../Methods/Methods.js')
exports.initCalculationController = (db) => {
    let controller = {}

    controller.calculation = (req, res, next) => {

        Promise.all([
            getTerrains(req.query.terrainsIds),
            getInstallation(req.query.instalationsIds)
        ])
            .then(([terrainResults, installationResults]) => {
                /*                          console.log("Terrain Results:", terrainResults);
                                         console.log("Installation Results:", installationResults); */

                let result
                switch (req.query.method) {
                    case "Maximum Expected Efficiency":
                        result = calculationByMethod(terrainResults, installationResults, req.query.balance, Methods.MaximumExpectedEfficiency.bind(Methods))
                        break;
                    case "Maximum Efficiency Under Most Probable Condition":
                        result = calculationByMethod(terrainResults, installationResults, req.query.balance, Methods.MaximumEfficiencyUnderMostProbableCondition.bind(Methods))
                        break;
                    case "Maximum Guaranteed Efficiency":
                        result = calculationByMethod(terrainResults, installationResults, req.query.balance, Methods.MaximumGuaranteedEfficiency.bind(Methods))
                        break;
                    case "Minimum Average Foregone Benefits":
                        result = calculationByMethod(terrainResults, installationResults, req.query.balance, Methods.MinimumAverageForegoneBenefits.bind(Methods))
                        break;
                    case "Minimum Missed Benefit Under Most Probable Condition":
                        result = calculationByMethod(terrainResults, installationResults, req.query.balance, Methods.MinimumMissedBenefitUnderMostProbableCondition.bind(Methods))
                        break;
                    case "Minimum Guaranteed Benefit Foregone":
                        result = calculationByMethod(terrainResults, installationResults, req.query.balance, Methods.MinimumGuaranteedBenefitForegone.bind(Methods))
                        break;
                }
                console.log('Ready!')
                res.status(200).send({ result });
            })
            .catch(error => {
                console.error(error);
                next(res.status(500).send(error));
            });
    };


    function getTerrains(terrainsIds) {
        return new Promise((resolve, reject) => {
            const terrainIds = terrainsIds.split(",");

            const sql = `SELECT * FROM terrains WHERE id IN (?);`;
            db.query(sql, [terrainIds], (err, results) => {
                if (err) {
                    console.error(err);
                    reject(err);
                    return;
                }
                Promise.all(results.map(result => getData(result.id)))
                    .then(dataResults => {
                        dataResults.forEach((result, index) => {
                            let temp = [];
                            let rad = [];
                            let wind = [];
                            let water = [];
                            let years = [];
                            result.sort((a, b) => { 
                                return a.year - b.year;
                            });
                           
                            for (const key in result) {
                                if (result[key].type == 'temperature') {
                                    temp.push(result[key].data)
                                } else if (result[key].type == 'solar radiation') {
                                    rad.push(result[key].data)
                                } else if (result[key].type == 'wind speed') {
                                    wind.push(result[key].data)
                                } else if (result[key].type == 'flow rate') {
                                    water.push(result[key].data)
                                }
                                 years.push(result[key].year)
                            }
                            // results[index]['data'] = result
                            delete results[index].name;
                            delete results[index].creator_id;
                            delete results[index].type;
                            delete results[index].last_change_time;
                            delete results[index].last_change_id;
                            results[index]['temp'] = temp;
                            results[index]['rad'] = rad;
                            results[index]['wind'] = wind;
                            results[index]['water'] = water;
                            results[index]['years'] = years;
                        });
                        resolve(results);
                    })
                    .catch((err) => {
                        next(res.status(500).send([err.message]));
                        reject(err);
                    });
            });
        });
    };

    function getData(terrainId) {
        return new Promise((resolve, reject) => {

            let sql = `SELECT * FROM terrains_data WHERE terrain_id = ${terrainId};`;
            db.query(sql, (err, result) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
    function getInstallation(installationId) {
        return new Promise((resolve, reject) => {
            const installationIds = installationId.split(",");
            let sql = `SELECT * FROM installations WHERE id IN (?);`;
            db.query(sql, [installationIds], (err, result) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    result.map(res => {
                        delete res.name;
                        delete res.creator_id;
                        let performanceFactors = res.performance_factors.split("-").map(str => parseFloat(str));
                        let intervals = res.intervals.split("-").map(str => parseFloat(str));
                        delete res.performance_factors;
                        delete res.intervals;
                        res['performanceFactors'] = performanceFactors;
                        res['intervals'] = intervals;
                        // res.performance_factors = res.performance_factors.split("-").map(str => parseFloat(str));
                        // res.intervals = res.intervals.split("-").map(str => parseFloat(str));                
                    })
                    result.sort((a, b) => {
                        return a.type.localeCompare(b.type);
                    });
                    resolve(result);
                }
            });
        });
    }
    function calculationByMethod(terrainResults, installationResults, balance, method) {
        let sumResult = {};
        let costs = [];
        let indexs = [];
        let efficiency = [];
        for (const terrain of terrainResults) {
            if (terrain.years.every(function(number) { return number % 1 !== 0; }) && terrain.temp.length % 4 == 0) {
                Methods.effTRS(terrain, installationResults);
            } else {
                Methods.effTR(terrain, installationResults);
            }
            method(terrain);
            costs.push(terrain.optimalPrice);
            efficiency.push(terrain.optimalValue);
            delete terrain.price;
            delete terrain.temp;
            delete terrain.rad;
            delete terrain.water;
            delete terrain.wind;
            delete terrain.efficiencyArrey;
            delete terrain.probabilityArray;
            delete terrain.years;
            if (terrain.optimalIndex == 0) {
                terrain['typeRES'] = 'solar installation';
            } else if (terrain.optimalIndex == 1) {
                terrain['typeRES'] = 'hydroelectric power plant';
            } else if (terrain.optimalIndex == 2) {
                terrain['typeRES'] = 'wind turbine';
            }
            delete terrain.optimalIndex;
        }
        Methods.knapSack(balance, costs, efficiency, indexs);
        sumResult = Methods.sumResult(costs, indexs, efficiency);
        return { ...sumResult, terrains: terrainResults.filter((element, index) => indexs[index] === 1) };
    }
    return controller
}