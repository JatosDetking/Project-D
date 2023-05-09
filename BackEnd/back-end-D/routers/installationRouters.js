const express = require('express');
const iC = require('./../controllers/installation')
const authorizationC = require('./../controllers/authorization')



exports.initInstallationRouter = (db) => {
    const installationRouter = express.Router();
    let installationController = iC.initInstallationController(db)
    let authorization = authorizationC.Authorization(db)

   // terrainRouter.get('/', terrainController.createTerrain);
   // terrainRouter.post('/add', authorization.getToken, authorization.verifyToken,authorization.getId, terrainController.createTerrain);
   // terrainRouter.put('/editterrain', authorization.getToken, authorization.verifyToken,authorization.getId, terrainController.editTerrain);
    //terrainRouter.get('/getallterrains', authorization.getToken, authorization.verifyToken, terrainController.getAllTerrains);
    //terrainRouter.get('/getterrain', authorization.getToken, authorization.verifyToken, terrainController.getTerrain);
    //terrainRouter.get('/getuserterrain', authorization.getToken, authorization.verifyToken, terrainController.getUserTerrains);
    //terrainRouter.get('/getmyterrain', authorization.getToken, authorization.verifyToken,authorization.getId, terrainController.getMyTerrains);
    //terrainRouter.delete('/deleteterrain', authorization.getToken, authorization.verifyToken,authorization.getId, terrainController.deleteTerrain);

    return installationRouter
}