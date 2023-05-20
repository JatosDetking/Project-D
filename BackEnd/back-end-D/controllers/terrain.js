const uC = require('./../controllers/user')


exports.initTerrainController = (db) => {
    let controller = {}
    let userController = uC.initUserController(db)

    controller.createTerrain = (req, res, next) => {

        const now = new Date();
        const year = now.getFullYear();
        const month = ('0' + (now.getMonth() + 1)).slice(-2);
        const day = ('0' + now.getDate()).slice(-2);
        const hours = ('0' + now.getHours()).slice(-2);
        const minutes = ('0' + now.getMinutes()).slice(-2);
        const seconds = ('0' + now.getSeconds()).slice(-2);

        const datetime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        let terrain = {
            name: req.body.name,
            price: req.body.price,
            creator_id: req.userId,
            type: req.body.type,
            last_change_time: datetime,
            last_change_id: req.userId
        }

        let sql = 'INSERT INTO terrains SET ?'
        db.query(sql, terrain, (err, result) => {
            if (err) {
                next(res.status(500).send([err.message]))
                throw err;
            }
            else {
                res.status(200).send(['Successfully add terrain.'])
            }
        })
    }


    controller.editTerrain = (req, res, next) => {

        let sql = `SELECT * FROM terrains WHERE id = ${req.body.id}`
        db.query(sql, (err, terrain) => {
            if (err) {
                res.status(500).send([err.message])
                return;
            } else {
                if (req.userId == terrain[0].creator_id || terrain[0].type == "editable") {
                    if (!req.body.price || !req.body.type || !req.body.name) {
                        res.status(400).send(['Incorrect data.'])
                        return
                    }
                    console.log(req);

                    const now = new Date();
                    const year = now.getFullYear();
                    const month = ('0' + (now.getMonth() + 1)).slice(-2);
                    const day = ('0' + now.getDate()).slice(-2);
                    const hours = ('0' + now.getHours()).slice(-2);
                    const minutes = ('0' + now.getMinutes()).slice(-2);
                    const seconds = ('0' + now.getSeconds()).slice(-2);

                    const datetime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
                    let updateTerrain = "";
                    if (req.userId == terrain[0].creator_id) {
                        updateTerrain = `UPDATE terrains SET name = '${req.body.name}', price = ${req.body.price}, type = '${req.body.type}', last_change_time = '${datetime}', last_change_id = ${req.userId} WHERE id = ${req.body.id};`;
                    }
                    else {
                        updateTerrain = `UPDATE terrains SET name = '${req.body.name}', price = ${req.body.price}, last_change_time = '${datetime}', last_change_id = ${req.userId} WHERE id = ${req.body.id};`;
                    }

                    db.query(updateTerrain, (err, results) => {
                        if (err) {
                            res.status(500).send(['Something went wrong with updateing suggestions.'])
                            throw err
                        } else {
                            let msg = `Terrain was updated.`
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

    controller.getAllTerrains = (req, res, next) => {

        let sql = `SELECT * FROM terrains;`;
        db.query(sql, (err, results) => {
            if (err) {
                res.status(500).send(['500'])
                throw err
            } else {
                let newResults = [];
                for (const key in results) {
                    if (results[key].creator_id == res.userId || results[key].type != "private") {
                        newResults.push(results[key]);
                    }
                }
                let msg = `Аll terrains for taken.`
                console.log(msg);
                res.status(200).send({ ...newResults });
                return;
            }
        });
    }

    controller.getTerrain = (req, res, next) => {

        let sql = `SELECT * FROM terrains WHERE id = ${req.query.id}`;
        db.query(sql, (err, results) => {
            if (err) {
                res.status(500).send(['500'])
                throw err
            } else {
                if (results[0].creator_id == res.userId || results[0].type != "private") {
                    let msg = `Terrain taken.`
                    console.log(msg);
                    res.status(200).send({ ...results[0] });
                    return;
                } else {
                    let msg = `Access denied.`
                    console.log(msg);
                    res.status(403).send([msg]);
                    return;
                }
            }
        });
    }

    controller.getUserTerrains = (req, res, next) => {

        userController.getUserId(db, req.query.email)
            .then(userId => {
                let sql = `SELECT * FROM terrains WHERE creator_id = ${userId}`;
                db.query(sql, (err, results) => {
                    if (err) {
                        res.status(500).send(['500'])
                        throw err
                    } else {
                        let newResults = [];
                        for (const key in results) {
                            if (results[key].creator_id == res.userId || results[key].type != "private") {
                                newResults.push(results[key]);
                            }
                        }
                        let msg = `Terrains taken.`
                        console.log(msg);
                        res.status(200).send({ ...newResults });
                        return;
                    }
                });
            })
            .catch(error => {
                console.error(error);
            });
    }

    controller.getMyTerrains = (req, res, next) => {

        let sql = `SELECT * FROM terrains WHERE creator_id = ${req.userId}`;
        db.query(sql, (err, results) => {
            if (err) {
                res.status(500).send(['500'])
                throw err
            } else {
                let msg = `Terrains taken.`
                console.log(msg);
                res.status(200).send({ ...results });
                return;
            }
        });
    }
    controller.deleteTerrain = (req, res, next) => {

        let sql = `SELECT * FROM terrains WHERE id = ${req.query.id}`
        db.query(sql, (err, terrain) => {
            if (err) {
                res.status(500).send([err.message])
                return;
            } else {
                if (req.userId == terrain[0].creator_id) {
                    let deleteTerr = `DELETE FROM terrains WHERE id = '${req.query.id}';`
                    db.query(deleteTerr, (err, results) => {
                        if (err) {
                            res.status(500).send(['Something went wrong with delete.'])
                            throw err
                        } else {
                            let msg = `Terrain is deleted.`
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