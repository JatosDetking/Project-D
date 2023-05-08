
exports.initTerrainVoteController = (db) => {
    let controller = {}

    controller.vote = (req, res, next) => {

        let sql = `INSERT INTO votes (user_id, terrain_id, type) VALUES (${req.userId}, ${req.body.terrainId}, ${req.body.vote}) ON DUPLICATE KEY UPDATE type = ${req.body.vote};`
        db.query(sql, (err, result) => {
            if (err) {
                next(res.status(500).send([err.message]));
                throw err;
            } else {
                res.status(200).send(['Successfully vote.']);
            }
        });
    };

    controller.getTerrainVotes = (req, res, next) => {

        let sql = `SELECT * FROM votes WHERE terrain_id = ${req.query.terrainId}`;

        db.query(sql, (err, results) => {
            if (err) {
                res.status(500).send(['500']);
                throw err;
            } else {
                let votes = {
                    upvote: 0,
                    downvote: 0
                };
                for (const element of results) {
                    if (element.type == 1) {
                        votes.upvote++;
                    } else if (element.type == 0) {
                        votes.downvote++;
                    }
                }
                let msg = `Votes taken.`;
                console.log(msg);
                res.status(200).send({ ...votes });
                return;
            }
        });
    };

    controller.getMyVote = (req, res, next) => {

        let sql = `SELECT * FROM votes WHERE user_id = ${req.userId} AND terrain_id = ${req.query.terrainId}`;

        db.query(sql, (err, results) => {
            if (err) {
                res.status(500).send(['500']);
                throw err;
            } else {

                let msg = `Vote taken.`;
                console.log(msg);
                res.status(200).send({ ...results });
                return;
            }
        });
    };

    controller.deleteTerrainVote = (req, res, next) => {

        let sql = `SELECT *
        FROM votes
        WHERE id = ${req.query.id};`
        db.query(sql, (err, resVote) => {
            if (err) {
                res.status(500).send([err.message])
                return;
            } else {
                if (req.userId == resVote[0].user_id) {

                    let deleteVote = `DELETE FROM votes
                        WHERE id = ${req.query.id};`

                    db.query(deleteVote, (err, results) => {
                        if (err) {
                            res.status(500).send(['Something went wrong with delete.'])
                            throw err
                        } else {
                            let msg = `Vote is deleted.`
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