const Methods = require('./../Methods/Methods.js')
exports.initCalculationController = (db) => {
    let controller = {}

    controller.calculation = (req, res, next) => {
        Promise.all([
            getTerrains(req.query.terrainsIds),
            getInstallation(req.query.instalationsIds)
        ])
            .then(([terrainResults, installationResults]) => {
                /*console.log("Terrain Results:", terrainResults);
                console.log("Installation Results:", installationResults);*/
                for (const terrain of terrainResults) {
                    Methods.effTR(terrain, installationResults);
                }
                switch (req.query.method) {
                    case "Maximum Expected Efficiency":
                      // Действия при "Maximum Expected Efficiency"
                      break;
                    case "Maximum Efficiency Under Most Probable Condition":
                      // Действия при "Maximum Efficiency Under Most Probable Condition"
                      break;
                    case "Maximum Guaranteed Efficiency":
                      // Действия при "Maximum Guaranteed Efficiency"
                      break;
                    case "Minimum Average Foregone Benefits":
                      // Действия при "Minimum Average Foregone Benefits"
                      break;
                    case "Minimum Missed Benefit Under Most Probable Condition":
                      // Действия при "Minimum Missed Benefit Under Most Probable Condition"
                      break;
                    case "Minimum Guaranteed Benefit Foregone":
                      // Действия при "Minimum Guaranteed Benefit Foregone"
                      break;
                  }
                res.status(200).send({
                    terrains: terrainResults,
                    installations: installationResults
                });
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
                                } else if (result[key].type == 'water level') {
                                    water.push(result[key].data)
                                }
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
                        res['performanceFactors'] =performanceFactors;   
                        res['intervals'] =intervals;            
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

    return controller
}