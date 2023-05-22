const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.initUserController = (db) => {
    let controller = {}

    controller.loginUser = (req, res, next) => {
        if (!req.query.email) {
            res.status(400).send(['No email proveded.'])
            return
        }
        let sql = `SELECT * FROM users WHERE email = '${req.query.email}'`
        db.query(sql, (err, result) => {
            if (err) {
                next(res.status(500))
            }
            else if (result.length == 0) {
                res.status(400).send(['There no profile with this email.'])
                return;
            }
            else if (bcrypt.compareSync(req.query.password, result[0].password)) {

                const token = jwt.sign({ userId: result[0].email }, 'secretkey');

                let date = new Date(Date.now() + 259200000);

                let tokenData = {
                    id: result[0].id,
                    token: token,
                    expires_at: date.toISOString().slice(0, 19).replace('T', ' ')
                }

                let loginInfo = {
                    email: result[0].email,
                    name: result[0].name,
                    username: result[0].username,
                    balance: result[0].balance,
                    id: result[0].id
                }

                console.log(tokenData)

                let sql = `INSERT INTO auth_tokens (id, token, expires_at)
                VALUES('${tokenData.id}', '${tokenData.token}', '${tokenData.expires_at}')
                ON DUPLICATE KEY UPDATE token = VALUES(token), expires_at = VALUES(expires_at);`
                db.query(sql, (err, result) => {
                    if (err) {
                        res.status(500).send([err.message])
                        return;
                    } else {
                        res.status(200).send({ token, message: 'Successfully login.', successful: true, ...loginInfo });
                    }
                })

            } else {
                res.status(401).send('Invalid password');
            }
        });
    }

    controller.registerUser = (req, res, next) => {

        bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
            if (err) {
                res.status(500).send([err.message])
                console.error(err);
                return;
            }
            req.body.password = hashedPassword;
            //console.log('Hashed password:', hashedPassword);

            let user = {
                email: req.body.email,
                username: req.body.username,
                password: req.body.password,
                name: req.body.name
            }

            let sql = 'INSERT INTO users SET ?'
            db.query(sql, user, (err, result) => {
                if (err) {
                    if (err.sqlMessage.includes('Duplicate entry')) {
                        res.status(409).send(['This email is already in use.'])
                        return;
                    } else {
                        next(res.status(500).send([err.message]))
                        throw err;
                    }
                } else {
                    res.status(200).send(['Successfully registered.'])
                }
            })
        });
    }

    controller.deleteUser = (req, res, next) => {

        let deleteUser = `DELETE FROM users WHERE id = '${req.userId}';`
        db.query(deleteUser, (err, results) => {
            if (err) {
                res.status(500).send(['Something went wrong with delete.'])
                throw err
            } else {
                let msg = `User is deleted.`
                console.log(msg);
                res.status(200).send([msg]);
                return;
            }
        });
    }

    controller.getBalance = (req, res, next) => {
        let sql = `SELECT balance FROM users WHERE id = '${req.userId}'`
        db.query(sql, (err, result) => {
            if (err) {
                next(res.status(500))
            }

            let balnce = result[0].balance;

            res.status(200).send({ balnce });
        });
    }

    controller.updateBalance = (req, res, next) => {
        if (!req.body.balance) {
            res.status(400).send(['No balance proveded.'])
            return
        }
        console.log(req);
        let newBalance = `UPDATE users SET balance = '${req.body.balance}' WHERE id = '${req.userId}';`
        db.query(newBalance, (err, results) => {
            if (err) {
                res.status(500).send(['Something went wrong with updateing suggestions.'])
                throw err
            } else {
                let msg = `Balance was updated.`
                console.log(msg);
                res.status(200).send([msg]);
                return;
            }
        });
    }

    controller.changePassword = (req, res, next) => {

        if (!req.body.password) {
            res.status(400).send(['No password proveded.'])
            return
        }
        console.log(req);

        bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
            if (err) {
                res.status(500).send([err.message])
                console.error(err);
                return;
            }
            req.body.password = hashedPassword;

            console.log(req.body.password);
            let newBalance = `UPDATE users SET password = '${req.body.password}' WHERE id = '${req.userId}';`
            db.query(newBalance, (err, results) => {
                if (err) {
                    res.status(500).send(['Something went wrong with updateing suggestions.'])
                    throw err
                } else {
                    let msg = `Password was updated.`
                    console.log(msg);
                    res.status(200).send([msg]);
                    return;
                }
            })
        });
    }

    controller.getUser = (req, res, next) => {

        let sql = `SELECT * FROM users WHERE id = '${req.query.id}'`
        db.query(sql, (err, result) => {
            if (err) {
                next(res.status(500))
            }
            if (result[0]) {
                let userInfo = {
                    email: result[0].email,
                    name: result[0].name,
                    username: result[0].username
                }
                res.status(200).send({ ...userInfo });
            }
            else {
                let userInfo = {
                    email: "",
                    name: "",
                    username: "Account is Deleted"
                }
                res.status(200).send({ ...userInfo });
            }

        });
    }
    controller.getMyUserInfo = (req, res, next) => {

        let sql = `SELECT * FROM users WHERE id = '${req.userId}'`
        db.query(sql, (err, result) => {
            if (err) {
                next(res.status(500))
            }
            let loginInfo = {
                email: result[0].email,
                name: result[0].name,
                username: result[0].username,
                token: result[0].token,
                balance: result[0].balance,
                id: result[0].id
            }
            res.status(200).send({ ...loginInfo });
        });
    }

    controller.getUserById = (db, id) => {
        return new Promise((resolve, reject) => {
          let sql = 'SELECT id, email, name, username FROM users WHERE id = ?;';
          db.query(sql, [id], (err, result) => {
            if (err) {
              reject(err);
            } else if (result.length === 0) {
              let userInfo = {
                id: id,
                email: '',
                name: '',
                username: 'Account is Deleted'
              };
              resolve(userInfo);
            } else {
              let userInfo = {
                id: result[0].id,
                username: result[0].username,
                email: result[0].email,
                name: result[0].name           
              };
              resolve(userInfo);
            }
          });
        });
      };
      

    controller.getAllUsers = (req, res, next) => {

        let sql = `SELECT * FROM users;`;
        db.query(sql, (err, results) => {
            if (err) {
                res.status(500).send(['500'])
                throw err
            } else {
                let msg = `Аll terrains for taken.`
                console.log(msg);

                for (const key in results) {
                    delete results[key].password;
                    delete results[key].balance;
                }
                res.status(200).send({ ...results });
                return;
            }
        });
    }


    return controller

}