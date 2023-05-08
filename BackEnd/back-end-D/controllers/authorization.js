const jwt = require('jsonwebtoken');

exports.Authorization = (db) => {

    let authorization = {};

    authorization.getToken = function (req, res, next) {

        const bearerHeader = req.headers['authorization'];
        if (typeof bearerHeader !== 'undefined') {

            const bearer = bearerHeader.split(' ');
            const bearerToken = bearer[1];
            req.token = bearerToken;
            next();
        }
        else {
            res.status(403).send(['unauthorization']);
        }
    }

    authorization.getId = function (req, res, next) {

        let sql = `SELECT id FROM auth_tokens WHERE token = '${req.token}';`;
        db.query(sql, (err, result) => {

            if (err) {
                res.status(500).send(['Something went wrong with updateing suggestions.'])
                throw (err);               
            }
            else {
                if (result.length > 0) {
                    req.userId = result[0].id;
                    next();
                }
                else {
                    res.status(403).send(['unauthorization']);
                }
            }
        })
    }

    authorization.verifyToken = (req, res, next) => {
        let newBalance = `SELECT expires_at FROM auth_tokens WHERE token = '${req.token}';`
        db.query(newBalance, (err, results) => {
            if (err) {
                res.status(500).send(['Something went wrong with updateing suggestions.'])
                throw err
            } else {
                if (results.length > 0) {
                    let date = new Date(results[0].expires_at);
                    let newDate = new Date(Date.now());
                    if (newDate.getTime() > date.getTime()) {
                        res.status(403).send(['unauthorization']);
                    } else {
                        next();
                    }
                }
                else {
                    res.status(403).send(['unauthorization']);
                }
                return;
            }
        })
    }
    return authorization
}