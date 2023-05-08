exports.initSuggestionController = (db) => {
    let controller = {}
    controller.getTags = (req, res, next) => {
        let sql = `SELECT * FROM suggestions WHERE type = 'tags'`
        db.query(sql, (err, result) => {
            if (err) {
                next(res.status(500))
            }
            if (result.length == 0) {
                res.status(400).send(['There are no tags rn.'])
                return;
            }
            res.send({ message: 'Tags fetched.', data: JSON.parse(result[0].vals), successful: true })
        })
    }
    controller.getLocations = (req, res, next) => {
        let sql = `SELECT * FROM suggestions WHERE type = 'locations'`
        db.query(sql, (err, result) => {
            if (err) {
                next(res.status(500))
            }
            if (result.length == 0) {
                res.status(400).send(['There are no locations rn.'])
                return;
            }
            res.send({ message: 'Locations fetched.', data: JSON.parse(result[0].vals), successful: true })
        })
    }
    controller.addTag = (req, res, next) => {
        let newtag = req.body.tag
        let sql = `SELECT * FROM suggestions WHERE type = 'tags'`
        db.query(sql, (err, result) => {
            if (err) {
                next(res.status(500))
            }
            if (result.length == 0) {
                res.status(400).send(['There are no tags rn.'])
                return;
            }
            console.log(result);
            let tags = JSON.parse(result[0].vals);
            if (!tags.includes(newtag)) {
                tags.push(newtag)
                let addTag = `UPDATE suggestions SET vals = '${JSON.stringify(tags)}' WHERE type = 'tags'`
                db.query(addTag, (err, results) => {
                    if (err) {
                        res.status(500).send(['Something went wrong with updateing suggestions.'])
                        throw err
                    } else {
                        let msg = `Tag was updated.`
                        console.log(msg);
                        res.status(200).send([msg]);
                        return;
                    }
                })
            }else{
                res.send({ message: 'Tag is already in the suggestions.', successful: false })
            }
        })
    }
    controller.addLocation = (req, res, next) => {
        let newlocation = req.body.location
        let sql = `SELECT * FROM suggestions WHERE type = 'locations'`
        db.query(sql, (err, result) => {
            if (err) {
                next(res.status(500))
            }
            if (result.length == 0) {
                res.status(400).send(['There are no locations rn.'])
                return;
            }
            console.log(result);
            let locations = JSON.parse(result[0].vals);
            if (!locations.includes(newlocation)) {
                locations.push(newlocation)
                let addLocation = `UPDATE suggestions SET vals = '${JSON.stringify(locations)}' WHERE type = 'locations'`
                db.query(addLocation, (err, results) => {
                    if (err) {
                        res.status(500).send(['Something went wrong with updateing suggestions.'])
                        throw err
                    } else {
                        let msg = `Location was updated.`
                        console.log(msg);
                        res.status(200).send([msg]);
                        return;
                    }
                })
            }else{
                res.send({ message: 'Location is already in the suggestions.', successful: false })
            }
        })
    }
    return controller
}