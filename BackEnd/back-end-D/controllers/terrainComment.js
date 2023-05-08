exports.initTerrainCommentController = (db) => {
    let controller = {}

    controller.addComment = (req, res, next) => {

        const now = new Date();
        const year = now.getFullYear();
        const month = ('0' + (now.getMonth() + 1)).slice(-2);
        const day = ('0' + now.getDate()).slice(-2);
        const hours = ('0' + now.getHours()).slice(-2);
        const minutes = ('0' + now.getMinutes()).slice(-2);
        const seconds = ('0' + now.getSeconds()).slice(-2);

        const datetime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        let sql = '';
        if (req.body.parent_id) {
            sql = `INSERT INTO comments (content, user_id, terrain_id, edit_date, parent_id)
            VALUES ('${req.body.content}', '${req.userId}', ${req.body.terrainId}, '${datetime}', ${req.body.parent_id});`;
        } else {
            sql = `INSERT INTO comments (content, user_id, terrain_id, edit_date)
            VALUES ('${req.body.content}', '${req.userId}', ${req.body.terrainId}, '${datetime}');`;
        }

        db.query(sql, (err, result) => {
            if (err) {
                next(res.status(500).send([err.message]));
                throw err;
            } else {
                res.status(200).send(['Successfully add Comment.']);
            }
        });
    };

    controller.editComment = (req, res, next) => {

        let sql = `SELECT * FROM comments WHERE id = ${req.body.id}`
        db.query(sql, (err, comment) => {
            if (err) {
                res.status(500).send([err.message])
                return;
            } else {
                if (req.userId == comment[0].user_id) {

                    const now = new Date();
                    const year = now.getFullYear();
                    const month = ('0' + (now.getMonth() + 1)).slice(-2);
                    const day = ('0' + now.getDate()).slice(-2);
                    const hours = ('0' + now.getHours()).slice(-2);
                    const minutes = ('0' + now.getMinutes()).slice(-2);
                    const seconds = ('0' + now.getSeconds()).slice(-2);

                    const datetime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

                    let sqlu = `UPDATE comments
                    SET content = '${req.body.content}', edit_date = '${datetime}'
                    WHERE id = ${req.body.id}`;

                    db.query(sqlu, (err, result) => {
                        if (err) {
                            next(res.status(500).send([err.message]));
                            throw err;
                        } else {
                            res.status(200).send(['Successfully update Comment.']);
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

    controller.deleteTerrainComment = (req, res, next) => {

        let sql = `SELECT *
        FROM comments
        WHERE id = ${req.query.id};`
        db.query(sql, (err, resVote) => {
            if (err) {
                res.status(500).send([err.message])
                return;
            } else {
                if (req.userId == resVote[0].user_id) {

                    let deleteVote = `DELETE FROM comments
                        WHERE id = ${req.query.id};`

                    db.query(deleteVote, (err, results) => {
                        if (err) {
                            res.status(500).send(['Something went wrong with delete.'])
                            throw err
                        } else {
                            let msg = `Comment is deleted.`
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

    controller.getTerrainComments = (req, res, next) => {

        let sql = `SELECT * FROM comments WHERE terrain_id = ${req.query.terrainId}`;
        //let sql2 = `SELECT * FROM subcomments WHERE terrain_id = ${req.query.terrainId}`;

        let comments = [];
        db.query(sql, (err, results) => {
            if (err) {
                res.status(500).send(['500']);
                throw err;
            } else {
                for (const element of results) {
                    if (element.parent_id == null) {
                        delete element.parent_id;
                        element['subComment'] = [];
                        comments.push(element);
                    }
                }

                for (const comment of comments) {
                    for (const subComment of results) {
                        if (comment.id == subComment.parent_id) {
                            comment.subComment.push(subComment);
                        }
                    }
                }

                let msg = `Comments taken.`;
                console.log(msg);
                res.status(200).send({ ...comments });
                return;
            }
        });
    };

    controller.getTerrainSubComment = (req, res, next) => {

        let sql = `SELECT * FROM comments WHERE terrain_id = ${req.query.terrainId}`;

        let comments = [];
        db.query(sql, (err, results) => {
            if (err) {
                res.status(500).send(['500']);
                throw err;
            } else {
                for (const element of results) {
                    if (element.parent_id == req.query.id) {
                        element['subComment'] = [];
                        comments.push(element);
                    }
                }
                let msg = `SubComments taken.`;
                console.log(msg);
                res.status(200).send({ ...comments });
                return;
            }
        });
    };

    return controller
}