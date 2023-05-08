const express = require('express');
const sC = require('./../controllers/suggestion')

exports.initSuggestionRouter = (db)=>{
    const suggestionRouter = express.Router();
    let suggestionController = sC.initSuggestionController(db)

    suggestionRouter.get('/get-tags',suggestionController.getTags);
    suggestionRouter.get('/get-locations',suggestionController.getLocations);
    suggestionRouter.post('/add-tag',suggestionController.addTag);
    suggestionRouter.post('/add-location',suggestionController.addLocation); 
    
    return suggestionRouter
}