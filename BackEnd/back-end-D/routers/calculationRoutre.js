const express = require('express');
const iC = require('../controllers/calculation')
const authorizationC = require('../controllers/authorization')



exports.initCalculationRouter = (db) => {
    const calculationRouter = express.Router();
    let calculationController = iC.initCalculationController(db)
    let authorization = authorizationC.Authorization(db)

    calculationRouter.get('/', authorization.getToken, authorization.verifyToken, calculationController.calculation);

    return calculationRouter
}