
exports.initTerrainDataController = (db) => {
    let controller = {}


    controller.addDataForTR = (req, res, next) => {

        let sql = `SELECT * FROM terrains WHERE id = ${req.body.terrainId}`
        db.query(sql, (err, terrain) => {
            if (err) {
                res.status(500).send([err.message])
                return;
            } else {
                if (req.userId == terrain[0].creator_id) {

                    let sql = `INSERT INTO terrains_data (data, type, year, terrain_id)
                   VALUES
                       (${req.body.temp}, 'temp', ${req.body.year}, ${req.body.terrainId}),
                       (${req.body.rad}, 'rad', ${req.body.year}, ${req.body.terrainId})`;

                    db.query(sql, (err, result) => {
                        if (err) {
                            if (err.code === 'ER_DUP_ENTRY') {
                                res.status(409).send(['Data already exists for this terrain and year.']);
                            } else {
                                next(res.status(500).send([err.message]));
                                throw err;
                            }
                        } else {
                            res.status(200).send(['Successfully add Data TR.']);
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
    };

    controller.addData = (req, res, next) => {

        let sql = `SELECT * FROM terrains WHERE id = ${req.body.terrainId}`
        db.query(sql, (err, terrain) => {
            if (err) {
                res.status(500).send([err.message])
                return;
            } else {
                if (req.userId == terrain[0].creator_id) {

                    let sql = `INSERT INTO terrains_data (data, type, year, terrain_id)
                   VALUES
                       (${req.body.data}, '${req.body.type}', ${req.body.year}, ${req.body.terrainId});`
                    db.query(sql, (err, result) => {
                        if (err) {
                            if (err.code === 'ER_DUP_ENTRY') {
                                res.status(409).send(['Data already exists for this terrain and year.']);
                            } else {
                                next(res.status(500).send([err.message]));
                                throw err;
                            }
                        } else {
                            res.status(200).send(['Successfully add Data.']);
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
    };

    controller.editDataForTR = (req, res, next) => {

        let sql = `SELECT * FROM terrains WHERE id = ${req.body.terrainId}`
        db.query(sql, (err, terrain) => {
            if (err) {
                res.status(500).send([err.message])
                return;
            } else {
                if (req.userId == terrain[0].creator_id || terrain[0].type == "editable") {

                    let sqlTemp = `UPDATE terrains_data
                    SET data = ${req.body.temp}
                    WHERE id = ${req.body.tempId};`;

                    let sqlRad = `UPDATE terrains_data
                    SET data = ${req.body.rad}
                    WHERE id = ${req.body.radId};`;

                    const now = new Date();
                    const year = now.getFullYear();
                    const month = ('0' + (now.getMonth() + 1)).slice(-2);
                    const day = ('0' + now.getDate()).slice(-2);
                    const hours = ('0' + now.getHours()).slice(-2);
                    const minutes = ('0' + now.getMinutes()).slice(-2);
                    const seconds = ('0' + now.getSeconds()).slice(-2);

                    const datetime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

                    let updateTerrain = `UPDATE terrains SET last_change_time = '${datetime}', last_change_id = ${req.userId} WHERE id = ${req.body.terrainId};`;

                    db.query(sqlTemp, (err, result) => {
                        db.query(sqlRad, (err, result) => {
                            if (err) {
                                next(res.status(500).send([err.message]));
                                throw err;
                            } else {
                                db.query(updateTerrain, (err, results) => {
                                });
                                res.status(200).send(['Successfully update Data TR.']);
                            }
                        });
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
    };

    controller.editData = (req, res, next) => {

        let sql = `SELECT * FROM terrains WHERE id = ${req.body.terrainId}`
        db.query(sql, (err, terrain) => {
            if (err) {
                res.status(500).send([err.message])
                return;
            } else {
                if (req.userId == terrain[0].creator_id || terrain[0].type == "editable") {

                    let sqlu = `UPDATE terrains_data
                    SET data = ${req.body.data}
                    WHERE id = ${req.body.id}`;

                    const now = new Date();
                    const year = now.getFullYear();
                    const month = ('0' + (now.getMonth() + 1)).slice(-2);
                    const day = ('0' + now.getDate()).slice(-2);
                    const hours = ('0' + now.getHours()).slice(-2);
                    const minutes = ('0' + now.getMinutes()).slice(-2);
                    const seconds = ('0' + now.getSeconds()).slice(-2);

                    const datetime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

                    let updateTerrain = `UPDATE terrains SET last_change_time = '${datetime}', last_change_id = ${req.userId} WHERE id = ${req.body.terrainId};`;

                    db.query(sqlu, (err, result) => {
                        if (err) {
                            next(res.status(500).send([err.message]));
                            throw err;
                        } else {
                            db.query(updateTerrain, (err, results) => {
                            });
                            res.status(200).send(['Successfully update Data.']);
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
    };

    controller.getDataFromTerrain = (req, res, next) => {

        let sql = `SELECT * FROM terrains_data WHERE terrain_id = ${req.query.terrainId}`;

        db.query(sql, (err, results) => {
            if (err) {
                res.status(500).send(['500'])
                throw err
            } else {
                let msg = `Data taken.`
                console.log(msg);
                res.status(200).send({ ...results });
                return;
            }
        });
    };

    controller.deleteTerrainData = (req, res, next) => {

        let sql = `SELECT * FROM terrains WHERE id = ${req.query.terrainId}`
        db.query(sql, (err, terrain) => {
            if (err) {
                res.status(500).send([err.message])
                return;
            } else {
                if (req.userId == terrain[0].creator_id) {

                    let deleteData = '';

                    if (req.query.data2Id != undefined) {
                        deleteData = `DELETE FROM terrains_data
                        WHERE id IN (${req.query.data1Id}, ${req.query.data2Id});
                        `
                    } else {
                        deleteData = `DELETE FROM terrains_data
                        WHERE id = ${req.query.data1Id};
                        `
                    }

                    db.query(deleteData, (err, results) => {
                        if (err) {
                            res.status(500).send(['Something went wrong with delete.'])
                            throw err
                        } else {
                            let msg = `Data is deleted.`
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

    return controller
}