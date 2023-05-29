const uC = require('./../controllers/user')

exports.initTerrainCommentController = (db) => {
    let controller = {}
    let userController = uC.initUserController(db)
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

        let comments = [];
        db.query(sql, async (err, results) => {
            if (err) {
                res.status(500).send(['500']);
                throw err;
            } else {
                try {
                    for (const element of results) {
                        if (element.parent_id == null) {
                            delete element.parent_id;
                            element['subComment'] = [];
                            comments.push(element);
                        }        
                    }
                    const commentPromises = comments.map(comment => {
                        return userController.getUserById(db, comment.user_id)
                          .then(user => {
                            comment.user = user;
                            delete comment.user_id;
                            const subComments = results.filter(subComment => comment.id == subComment.parent_id);
                            const subCommentPromises = subComments.map(subComment => {
                              return userController.getUserById(db, subComment.user_id)
                                .then(user => {
                                  subComment.user = user;
                                  delete subComment.terrain_id;
                                  delete subComment.parent_id;
                                  delete subComment.user_id;
                                });
                            });
                            return Promise.all(subCommentPromises)
                              .then(() => {
                                comment.subComment = subComments;
                                delete comment.terrain_id;
                                return comment;
                              });
                          });
                      });
                      
                      Promise.all(commentPromises)
                        .then(updatedComments => {
                            let msg = `Comments taken.`;
                            console.log(msg);
                            res.status(200).send({ ...comments });
                        });
                /*     for (const comment of comments) {
                        for (const subComment of results) {
                            comment.user = await userController.getUserById(db, comment.user_id);
                            if (comment.id == subComment.parent_id) {
                                subComment.user = await userController.getUserById(db, subComment.user_id);
                                delete subComment.terrain_id;
                                delete subComment.parent_id;
                                comment.subComment.push(subComment);
                            }
                        }
                        delete comment.terrain_id;
                    }                   */
                
                }
                catch (error) {
                    console.error('Error getting user information:', error);
                    res.status(500).send('Error getting user information');
                }
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