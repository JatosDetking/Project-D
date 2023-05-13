
const Installation = require('./../classes/Installation');


exports.initInstallationController = (db) => {
    let controller = {}

    controller.createInstallation = (req, res, next) => {

        let installation = {
            intervals: req.body.intervals,
            performance_factors: req.body.performance_factors,
            type: req.body.type,
            price: req.body.price,
            creator_id: req.userId
        }

        let sql = 'INSERT INTO installations SET ?'
        db.query(sql, installation, (err, result) => {
            if (err) {
                next(res.status(500).send([err.message]))
                throw err;
            }
            else {
                res.status(200).send(['Successfully add installation.'])
            }
        })
    }

    controller.editInstallation = (req, res, next) => {

        let sql = `SELECT * FROM installations WHERE id = ${req.body.id}`
        db.query(sql, (err, installation) => {
            if (err) {
                res.status(500).send([err.message])
                return;
            } else {
                if (req.userId == installation[0].creator_id) {

                    updateTerrain = `UPDATE installations SET 
                    intervals = '${req.body.intervals}',
                    performance_factors = '${req.body.performance_factors}',
                    price = ${req.body.price}
                    WHERE id = ${req.body.id}`;

                    db.query(updateTerrain, (err, results) => {
                        if (err) {
                            res.status(500).send(['Something went wrong with updateing suggestions.'])
                            throw err
                        } else {
                            let msg = `Installation was updated.`
                            console.log(msg);
                            res.status(200).send([msg]);
                            return;
                        }
                    });
                }
                else {
                    let msg = `Access denied.`
                    console.log(msg);
                    res.status(403).send([msg]);
                    return;
                }
            }
        })
    }
    controller.deleteInstallation = (req, res, next) => {

        let sql = `SELECT * FROM installations WHERE id = ${req.query.id}`
        db.query(sql, (err, installation) => {
            if (err) {
                res.status(500).send([err.message])
                return;
            } else {
                if (req.userId == installation[0].creator_id) {
                    let deleteTerr = `DELETE FROM installations WHERE id = '${req.query.id}';`
                    db.query(deleteTerr, (err, results) => {
                        if (err) {
                            res.status(500).send(['Something went wrong with delete.'])
                            throw err
                        } else {
                            let msg = `Installation is deleted.`
                            console.log(msg);
                            res.status(200).send([msg]);
                            return;
                        }
                    });
                }
                else {
                    let msg = `Access denied.`
                    console.log(msg);
                    res.status(403).send([msg]);
                    return;
                }
            }
        })
    }

    controller.getInstallation = (req, res, next) => {

        let sql = `SELECT * FROM installations WHERE id = ${req.query.id}`;
        db.query(sql, (err, results) => {
            if (err) {
                res.status(500).send(['500'])
                throw err
            } else {
                let msg = `Installation taken.`
               // let intervals = results[0].intervals.split("-")
               // let performanceFactors = results[0].performance_factors.split("-")
               // takenInstallation = new Installation(results[0].type,intervals,performanceFactors,results[0].price,)
               // console.log(takenInstallation);
                console.log(msg);
                res.status(200).send({ ...results });
                return;
            }
        });
    }
    controller.getAllInstallation = (req, res, next) => {

        let sql = `SELECT * FROM installations`;
        db.query(sql, (err, results) => {
            if (err) {
                res.status(500).send(['500'])
                throw err
            } else {
                let msg = `Installations taken.`
                console.log(msg);
                res.status(200).send({ ...results });
                return;
            }
        });
    }
    controller.getAllInstallationOfType = (req, res, next) => {
        let sql = `SELECT * FROM installations WHERE type = '${req.query.type}'`;
        db.query(sql, (err, results) => {
          if (err) {
            res.status(500).send('500');
            throw err;
          } else {
            let msg = `Installations of type ${req.query.type} taken.`;
            console.log(msg);
            res.status(200).send({ ...results });
            return;
          }
        });
      };
      
    return controller
}