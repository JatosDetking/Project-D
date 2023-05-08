exports.initGroupsController = (db) => {
    let controller = {}
    controller.createGroupTable = (req, res, next) => {
        let group_name = req.body.group_name;
        let username = req.body.username;
        let group = {
            name: group_name,
            users: JSON.stringify({ "root_admin": username })
        }
        let sqlAddToGroupsTable = 'INSERT INTO groop SET ?'
        db.query(sqlAddToGroupsTable, group, (err, resultFromAdd) => {
            if (err) {
                res.status(500).send(['Something went wrong with adding the group into droups Table.' + group_name])
                throw err
            } else {
                console.log(`All_exprenses_${username} for ${username} was added to groop table.`);
                console.log(resultFromAdd);
                let sql = `CREATE TABLE ${group_name+resultFromAdd.insertId}(id int AUTO_INCREMENT, product_name VARCHAR(255), place VARCHAR(255), should_track BOOL, tags VARCHAR(255), price DOUBLE(10, 5), date BIGINT, PRIMARY KEY(id))`;
                db.query(sql, (err, result) => {
                    if (err) {
                        res.status(500).send(['Something went wrong with creating group table ' + group_name])
                        throw err
                    } else {
                        console.log(`${group_name} table was created`);
                        res.status(200).send(['Group table "' + group_name + '" was created successfully.']);
                        return;
                    }
                })
            }
        })
    }
    controller.deleteGroupTable = (req, res, next) => {
        let group_name = req.query.group_name
        let group_id = req.query.group_id
        let sqlDeleteFromGroupsTable = `DELETE FROM groop WHERE name = '${group_name}' AND id = ${group_id}`
        db.query(sqlDeleteFromGroupsTable, (err, results) => {
            if (err) {
                res.status(500).send(['Something went wrong with delete group from groups table.' + group_name + group_id])
                throw err
            } else {
                console.log(`${group_name+group_id} group was removed from groups table`);
                let sql = `DROP TABLE ${group_name+group_id}`
                db.query(sql, (err, results) => {
                    if (err) {
                        res.status(500).send(['Something went wrong with group table drop.' + group_name + group_id])
                        throw err
                    } else {
                        console.log(`${group_name} table was deleted`);
                        res.status(200).send(['Group table "' + group_name + group_id + '" was deleted successfully.']);
                        return;
                    }
                })
            }
        })
    }
    controller.editGroupUsers = (req, res, next) => {
        let group_name = req.body.group_name
        let group_id = req.body.group_id

        let action = req.body.action // move / remove / add
        let username = req.body.username // string
        let location = req.body.location // admin / guest
            
        let checkUserExist = `SELECT * FROM users WHERE username = '${username}'`
        db.query(checkUserExist, (err, result) => {
            if (err) {
                next(res.status(500))
                return
            }
            if (result.length == 0) {
                res.status(400).send(['There no profile with this username.'])
                return;
            }
            let getGroup = `SELECT * FROM groop WHERE name = '${group_name}' AND id = ${group_id}`
            db.query(getGroup, (err, groupResult) => {
                let sendMsg = (...args)=>{
                    res.status(500).send([args]);
                }
                if (err) {
                    res.status(500).send(['Something went wrong with group table get.' + group_name + group_id])
                    throw err
                } else {
                    if (groupResult.length > 0) {
                        console.log(groupResult,req.body);
                        let users =JSON.parse(groupResult[0].users)
                            /* users:{
                                root_admin:string,
                                admins?:string[],
                                guests?:string[]
                            } */
                        if (action == 'move') {
                            if(
                                ((users.admins&&!users.admins.includes(username))||!users.admins)&&
                                ((users.guests&&!users.guests.includes(username))||!users.guests)
                                ){
                                sendMsg('There is no user to move.',req.body);
                                return
                            }else{
                                if(users.admins&&users.admins.includes(username)){
                                    users.admins = users.admins.filter(name => name != username)
                                }else if(users.guests&&users.guests.includes(username)){
                                    users.guests = users.guests.filter(name => name != username)
                                }
                                if(location != 'guests'&&location != 'admins'){
                                    sendMsg('Location is incorrect ',req.body)
                                    return
                                }else{
                                    if(!users[location]){
                                        users[location] = []
                                    }
                                    if(!users[location].includes(username)){
                                        users[location].push(username);
                                    }else{
                                        sendMsg('User already in location.',req.body)
                                        return
                                    }
                                }
                            }
                        } else if (action == 'remove') {
                            if(
                                ((users.admins&&!users.admins.includes(username))||!users.admins)&&
                                ((users.guests&&!users.guests.includes(username))||!users.guests)
                                ){
                                sendMsg('There is nothing to remove.',req.body)
                                return
                            }else{
                                if(users.admins&&users.admins.includes(username)){
                                    users.admins = users.admins.filter(name => name != username)
                                }else if(users.guests&&users.guests.includes(username)){
                                    users.guests = users.guests.filter(name => name != username)
                                }
                            }
                        } else if (action == 'add') {
                            if(location != 'guests'&&location != 'admins'){
                                sendMsg('Location is incorrect',req.body)
                                return
                            }else if(
                                (users.admins&&users.admins.includes(username))||
                                (users.guests&&users.guests.includes(username))
                                ){
                                sendMsg('User already in group. You can change his role.',req.body)
                                return
                            }else{
                                if(!users[location]){
                                    users[location] = []
                                }
                                if(!users[location].includes(username)){
                                    users[location].push(username)
                                }else{
                                    sendMsg('User already in location.',req.body)
                                    return
                                }
                            }
                        }else if (action == 'make_root'){
                            if(
                                ((users.admins&&!users.admins.includes(username))||!users.admins)&&
                                ((users.guests&&!users.guests.includes(username))||!users.guests)
                                ){
                                sendMsg('There is no user to make root.',req.body)
                                return
                            }else{
                                if(users.admins&&users.admins.includes(username)){
                                    users.admins = users.admins.filter(name => name != username)
                                }else if(users.guests&&users.guests.includes(username)){
                                    users.guests = users.guests.filter(name => name != username)
                                }
                                let oldRoot = users.root_admin;
                                users.root_admin = username;
                                if(!users['admins']){
                                    users['admins'] = []
                                }
                                if(!users['admins'].includes(oldRoot)){
                                    users['admins'].push(oldRoot);
                                }else{
                                    sendMsg('User already in location.',req.body)
                                    return
                                }

                            }
                        }else {
                            sendMsg('Incorrect data:',req.body)
                            return
                        }
                        let updateGrupUsers = `UPDATE groups SET users = '${JSON.stringify(users)}' WHERE name = '${group_name}' AND id = ${group_id}`
                        db.query(updateGrupUsers, (err, results) => {
                            if (err) {
                                res.status(500).send(['Something went wrong with updateing users.'])
                                throw err
                            } else {
                                let msg = `Users were updated.`
                                console.log(msg);
                                res.status(200).send([msg]);
                                return;
                            }
                        })
                    } else {
                        res.status(500).send(['Something went wrong with group table get.No group was found.' + group_name + group_id])
                        return
                    }
                }
            })
        })


    }
    controller.addExpenseToGroupTable = (req, res, next) => {
        let group_name = req.body.group_name
        let group_id = req.body.group_id
        let expense = {
            product_name: req.body.product_name,
            place: req.body.place,
            should_track: req.body.should_track,
            tags: req.body.tags,
            price: req.body.price,
            date: req.body.date
        }
        let sql = `INSERT INTO ${group_name+group_id} SET ?`
        db.query(sql, expense, (err, results) => {
            if (err) {
                res.status(500).send(['Something went wrong.'])
                throw err
            } else {
                let msg = `${JSON.stringify(expense)} expense was added to ${group_name+group_id} table.`
                console.log(msg);
                res.status(200).send([msg]);
                return;
            }
        })
    }
    controller.deleteExpenseFromGroup = (req, res, next) => {
        let group_name = req.body.group_name
        let group_id = req.body.group_id

        let exp_id = req.body.exp_id
        let sql = `DELETE FROM ${group_name+group_id} WHERE id = ${exp_id}`
        db.query(sql, (err, results) => {
            if (err) {
                res.status(500).send(['Something went wrong with deleting an expense.|exp_id:' + exp_id + "|" + "group_name:" + group_name + group_id])
                throw err
            } else {
                let msg = `${exp_id} expense was deleted from ${group_name+group_id} table.`
                console.log(msg);
                res.status(200).send([msg]);
                return;
            }
        })
    }
    controller.editExpenseInGroup = (req, res, next) => {
        let group_name = req.body.group_name
        let group_id = req.body.group_id
        let exp_id = req.body.exp_id
        let expense = {
            product_name: req.body.product_name,
            place: req.body.place,
            should_track: req.body.should_track,
            tags: req.body.tags,
            price: req.body.price,
            date: req.body.date
        }
        let sql = `UPDATE ${group_name+group_id} SET product_name = '${expense.product_name}', place = '${expense.place}', should_track = '${expense.should_track}', tags = '${expense.tags}', price = '${expense.price}', date = '${expense.date}' WHERE id = ${exp_id}`
        db.query(sql, (err, results) => {
            if (err) {
                res.status(500).send(['Something went wrong with with updating:' + exp_id + "|" + "group_name:" + group_name + group_id])
                throw err
            } else {
                let msg = `${exp_id} expense was updated in ${group_name+group_id} table.`
                console.log(msg);
                res.status(200).send([msg]);
                return;
            }
        })
    }
    controller.getGroupTable = (req, res, next) => {
        let group_name = req.query.group_name
        let group_id = req.query.group_id

        let sql = `SELECT * FROM ${group_name+group_id}`
        db.query(sql, (err, results) => {
            if (err) {
                res.status(500).send(['Something went wrong with group fetch.' + group_name + group_id])
                throw err
            } else {
                let msg = `All expenses from table ${group_name+group_id} were seccessfully fetched.`
                console.log(msg);
                res.status(200).send({ data: results, msg });
                return;
            }
        })
    }
    controller.getAllGroupsTablesForUser = (req, res, next) => {
        let username = req.query.username
        let sql = `SELECT * FROM groop WHERE users LIKE '%"${username}"%'`
        db.query(sql, (err, results) => {
            if (err) {
                res.status(500).send(['Something went wrong with all groups names for user fetch.' + username])
                throw err
            } else {
                let msg = `All expenses from table  were seccessfully fetched.`
                console.log(results);
                res.status(200).send(results);
                return;
            }
        })
    }
    controller.getGroupInfo = (req, res, next) => {
        let group_name = req.query.group_name 
        let group_id = req.query.group_id
        let getGroup = `SELECT * FROM groop WHERE name = '${group_name}' AND id = ${group_id}`
        db.query(getGroup, (err, result) => {
            if (err) {
                res.status(500).send(['Something went wrong getting group info.' + username])
                throw err
            } else {
                let msg = `Group info fetched.`
                let resObj = { msg, data: result }
                console.log(resObj);
                res.status(200).send(resObj);
                return;
            }
        })
    }
    return controller
}