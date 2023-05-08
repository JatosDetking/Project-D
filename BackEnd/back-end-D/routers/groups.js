const express = require('express');
const gC = require('./../controllers/groups')

exports.initGroupsRouter = (db)=>{
    const groupsRouter = express.Router();
    let groupsController = gC.initGroupsController(db)

    groupsRouter.get('/all-for-user',groupsController.getAllGroupsTablesForUser);
    groupsRouter.get('/get-group',groupsController.getGroupTable);
    groupsRouter.post('/create',groupsController.createGroupTable);
    groupsRouter.get('/delete',groupsController.deleteGroupTable);
    groupsRouter.post('/add-item',groupsController.addExpenseToGroupTable);
    groupsRouter.post('/delete-item',groupsController.deleteExpenseFromGroup);
    groupsRouter.get('/get-group-info',groupsController.getGroupInfo);
    groupsRouter.post('/edit-group-users',groupsController.editGroupUsers);
    groupsRouter.post('/edit',groupsController.editExpenseInGroup);
    return groupsRouter
}