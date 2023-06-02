const express = require('express');
const tCC = require('./../controllers/terrainComment')
const authorizationC = require('../controllers/authorization')

exports.initTerrainCommentRouter = (db) => {
    const terrainCommentRouter = express.Router();
    let terrainnCommentController = tCC.initTerrainCommentController(db)
    let authorization = authorizationC.Authorization(db)

    terrainCommentRouter.post('/comment', authorization.getToken, authorization.verifyToken,authorization.getId, terrainnCommentController.addComment);
    terrainCommentRouter.put('/editcomment', authorization.getToken, authorization.verifyToken,authorization.getId, terrainnCommentController.editComment);
    terrainCommentRouter.delete('/deletecomment', authorization.getToken, authorization.verifyToken,authorization.getId, terrainnCommentController.deleteTerrainComment);
    terrainCommentRouter.get('/getterraincomments', authorization.getToken, authorization.verifyToken, authorization.getId, terrainnCommentController.getTerrainComments);
    terrainCommentRouter.get('/getterrainsubcomments', authorization.getToken, authorization.verifyToken, authorization.getId, terrainnCommentController.getTerrainSubComment);

    return terrainCommentRouter
}