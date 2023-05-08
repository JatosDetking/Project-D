const express = require('express');
const tDC = require('./../controllers/terrainData')
const authorizationC = require('../controllers/authorization')



exports.initTerrainDataRouter = (db) => {
    const terrainDataRouter = express.Router();
    let terrainDataController = tDC.initTerrainDataController(db)
    let authorization = authorizationC.Authorization(db)

    terrainDataRouter.post('/addtrdata', authorization.getToken, authorization.verifyToken,authorization.getId, terrainDataController.addDataForTR);
    terrainDataRouter.post('/adddata', authorization.getToken, authorization.verifyToken,authorization.getId, terrainDataController.addData);
    terrainDataRouter.put('/edittrdata', authorization.getToken, authorization.verifyToken,authorization.getId, terrainDataController.editDataForTR);
    terrainDataRouter.put('/editdata', authorization.getToken, authorization.verifyToken,authorization.getId, terrainDataController.editData);
    terrainDataRouter.get('/getdata', authorization.getToken, authorization.verifyToken, terrainDataController.getDataFromTerrain);
    terrainDataRouter.delete('/deletedata', authorization.getToken, authorization.verifyToken,authorization.getId, terrainDataController.deleteTerrainData);
    
    return terrainDataRouter
}