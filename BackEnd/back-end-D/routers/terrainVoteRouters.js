const express = require('express');
const tVC = require('./../controllers/terrainVote')
const authorizationC = require('../controllers/authorization')

exports.initTerrainVoteRouter = (db) => {
    const terrainVoteRouter = express.Router();
    let terrainVoteController = tVC.initTerrainVoteController(db)
    let authorization = authorizationC.Authorization(db)

    terrainVoteRouter.post('/', authorization.getToken, authorization.verifyToken,authorization.getId, terrainVoteController.vote);
    terrainVoteRouter.get('/getterrainvotes', authorization.getToken, authorization.verifyToken, terrainVoteController.getTerrainVotes);
    terrainVoteRouter.get('/getmyvote', authorization.getToken, authorization.verifyToken,authorization.getId, terrainVoteController.getMyVote);
    terrainVoteRouter.delete('/deletemyvote', authorization.getToken, authorization.verifyToken,authorization.getId, terrainVoteController.deleteTerrainVote);

    return terrainVoteRouter
}