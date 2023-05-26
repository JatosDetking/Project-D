exports.initCalculationController = (db) => {
    let controller = {}
    controller.calculation = (req, res, next) => {
        getTerrains(req.query.terrainsIds)
        .then(results => {
            console.log(results);
        })
        .catch(error => {
            console.error(error);
        });
    };

    function getTerrains(terrainsIds){
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
    return controller
}