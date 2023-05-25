const express = require('express');
const tC = require('./../controllers/terrain')
const authorizationC = require('./../controllers/authorization')



exports.initTerrainRouter = (db) => {
    const terrainRouter = express.Router();
    let terrainController = tC.initTerrainController(db)
    let authorization = authorizationC.Authorization(db)

    // terrainRouter.get('/', terrainController.createTerrain);
    terrainRouter.post('/add', authorization.getToken, authorization.verifyToken, authorization.getId, terrainController.createTerrain);
    terrainRouter.put('/editterrain', authorization.getToken, authorization.verifyToken, authorization.getId, terrainController.editTerrain);
    terrainRouter.get('/getallterrains', authorization.getToken, authorization.verifyToken, authorization.getId, terrainController.getAllTerrains);
    terrainRouter.get('/getterrain', authorization.getToken, authorization.verifyToken, terrainController.getTerrain);
    terrainRouter.get('/getuserterrain', authorization.getToken, authorization.verifyToken, terrainController.getUserTerrains);
    terrainRouter.get('/getmyterrain', authorization.getToken, authorization.verifyToken, authorization.getId, terrainController.getMyTerrains);
    terrainRouter.delete('/deleteterrain', authorization.getToken, authorization.verifyToken, authorization.getId, terrainController.deleteTerrain);

    return terrainRouter
}