const express = require('express');
const iC = require('../controllers/calculation')
const authorizationC = require('../controllers/authorization')



exports.initCalculationRouter = (db) => {
    const calculationRouter = express.Router();
    let calculationController = iC.initCalculationController(db)
    let authorization = authorizationC.Authorization(db)

    calculationRouter.get('/', authorization.getToken, authorization.verifyToken, calculationController.calculation);
   // installationRouter.get('/', terrainController.createTerrain);
 /*  installationRouter.post('/add', authorization.getToken, authorization.verifyToken,authorization.getId, installationController.createInstallation);
   installationRouter.put('/edit', authorization.getToken, authorization.verifyToken,authorization.getId, installationController.editInstallation);
   installationRouter.get('/get', authorization.getToken, authorization.verifyToken, installationController.getInstallation);
   installationRouter.get('/getall', authorization.getToken, authorization.verifyToken, installationController.getAllInstallation);
   installationRouter.get('/getalloftype', authorization.getToken, authorization.verifyToken, installationController.getAllInstallationOfType);
   installationRouter.get('/getallofuser', authorization.getToken, authorization.verifyToken, installationController.getAllUserInstallation);
    //terrainRouter.get('/getallterrains', authorization.getToken, authorization.verifyToken, terrainController.getAllTerrains);
    //terrainRouter.get('/getterrain', authorization.getToken, authorization.verifyToken, terrainController.getTerrain);
    //terrainRouter.get('/getuserterrain', authorization.getToken, authorization.verifyToken, terrainController.getUserTerrains);
    //terrainRouter.get('/getmyterrain', authorization.getToken, authorization.verifyToken,authorization.getId, terrainController.getMyTerrains);
    installationRouter.delete('/delete', authorization.getToken, authorization.verifyToken,authorization.getId, installationController.deleteInstallation);*/

    return calculationRouter
}