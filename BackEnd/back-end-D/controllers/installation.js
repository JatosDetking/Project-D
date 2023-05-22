
const Installation = require('./../classes/Installation');
const uC = require('./../controllers/user')



exports.initInstallationController = (db) => {
    let controller = {}
    let userController = uC.initUserController(db)

    controller.createInstallation = (req, res, next) => {

        let installation = {
            name: req.body.name,
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
                    name = '${req.body.name}',
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
               /* let intervals = results[0].intervals.split("-")
                let performanceFactors = results[0].performance_factors.split("-")
                let stringIntervals = '(0; ' + intervals[0] + ') (' + intervals[1] + '; ' + intervals[2] + ') (' + intervals[2] + '; ∞)';
                let stringPerformanceFactors = 'For the interval (0; ' + intervals[0] + ')' + ' the value is ' + performanceFactors[0] + '. \n' +
                    'For the interval (' + intervals[1] + '; ' + intervals[2] + ') the value is ' + performanceFactors[1] + '. \n' +
                    'For the interval (' + intervals[2] + '; ∞) the value is ' + performanceFactors[2] + '.';
                results[0].intervals = stringIntervals;
                results[0].performance_factors = stringPerformanceFactors;*/

                userController.getUserById(db, results[0].creator_id)
                    .then((user) => {
                        results[0].creator = user;
                        delete results[0].creator_id;
                        console.log(msg);
                        res.status(200).send({ ...results[0] });
                        return;
                    })
                    .catch((err) => {
                        console.error(err);

                    });

                // takenInstallation = new Installation(results[0].type,intervals,performanceFactors,results[0].price,)
                // console.log(takenInstallation);

            }
        });
    }
    controller.getAllInstallation = (req, res, next) => {
        let sql = `SELECT * FROM installations`;
        db.query(sql, async (err, results) => {
          if (err) {
            res.status(500).send('500');
            throw err;
          } else {
            let msg = 'Installations taken.';
            for (const key in results) {
            /*  let intervals = results[key].intervals.split('-');
              let performanceFactors = results[key].performance_factors.split('-');
              let stringIntervals = '(0; ' + intervals[key] + ') (' + intervals[1] + '; ' + intervals[2] + ') (' + intervals[2] + '; ∞)';
              let stringPerformanceFactors = 'For the interval (0; ' + intervals[0] + ')' + ' the value is ' + performanceFactors[0] + '. \n' +
                'For the interval (' + intervals[1] + '; ' + intervals[2] + ') the value is ' + performanceFactors[1] + '. \n' +
                'For the interval (' + intervals[2] + '; ∞) the value is ' + performanceFactors[2] + '.';
              results[key].intervals = stringIntervals;
              results[key].performance_factors = stringPerformanceFactors;*/
      
              try {
                const user = await userController.getUserById(db, results[key].creator_id);
                results[key].creator = user;
                delete results[key].creator_id;
              } catch (err) {
                console.error(err);
              }
            }
      
            console.log(msg);
            res.status(200).send({ ...results });
            return;
          }
        });
      };
      
      controller.getAllInstallationOfType = (req, res, next) => {
        let sql = `SELECT * FROM installations WHERE type = ?`;
        let type = req.query.type;
        
        db.query(sql, [type], async (err, results) => {
          if (err) {
            res.status(500).send('500');
            throw err;
          } else {
            let msg = `Installations of type ${type} taken.`;
            for (const key in results) {
             /* let intervals = results[key].intervals.split("-");
              let performanceFactors = results[key].performance_factors.split("-");
              let stringIntervals = `(0; ${intervals[key]}) (${intervals[1]}; ${intervals[2]}) (${intervals[2]}; ∞)`;
              let stringPerformanceFactors = `For the interval (0; ${intervals[0]}) the value is ${performanceFactors[0]}. \n` +
                `For the interval (${intervals[1]}; ${intervals[2]}) the value is ${performanceFactors[1]}. \n` +
                `For the interval (${intervals[2]}; ∞) the value is ${performanceFactors[2]}.`;
              results[key].intervals = stringIntervals;
              results[key].performance_factors = stringPerformanceFactors;*/
      
              try {
                const user = await userController.getUserById(db, results[key].creator_id);
                results[key].creator = user;
                delete results[key].creator_id;
              } catch (err) {
                console.error(err);
              }
            }
      
            console.log(msg);
            res.status(200).send({ ...results });
            return;
          }
        });
      };
      

    return controller
}