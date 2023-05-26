
const Installation = require('./../classes/Terrain');

exports.initCalculationController = (db) => {
    let controller = {}
    controller.calculation = (req, res, next) => {
        const userId = req.userId;
        const terrainIds = req.query.terrainsIds.split(",");

        const sql = `SELECT * FROM terrains WHERE id IN (?);`;
        db.query(sql, [terrainIds], (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send('500');
                return;
            }
            for (const key in results) {
                getData(results[key].id)
                    .then((result) => {
                        console.log(result);
                        
                    })
                    .catch((err) => {
                        next(res.status(500).send([err.message]));
                        throw err;
                    });
            }     
            res.status(200).send(results);
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