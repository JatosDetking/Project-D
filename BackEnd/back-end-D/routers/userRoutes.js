const express = require('express');
const uC = require('./../controllers/user')
const authorizationC = require('./../controllers/authorization')



exports.initUserRouter = (db) => {
    const userRouter = express.Router();
    let userController = uC.initUserController(db)
    let authorization = authorizationC.Authorization(db)

  //  userRouter.get('/', userController.loginUser);
    userRouter.post('/register', userController.registerUser);
    userRouter.put('/updatebalance', authorization.getToken, authorization.verifyToken,authorization.getId, userController.updateBalance);
    userRouter.put('/changepassword', authorization.getToken, authorization.verifyToken,authorization.getId, userController.changePassword);
    userRouter.get('/login', userController.loginUser);
    userRouter.get('/getuser',authorization.getToken, authorization.verifyToken, userController.getUser);
    userRouter.get('/getmyinfo', authorization.getToken, authorization.verifyToken,authorization.getId, userController.getMyUserInfo);
    userRouter.get('/getbalance', authorization.getToken, authorization.verifyToken,authorization.getId, userController.getBalance);
    userRouter.get('/getallusers', authorization.getToken, authorization.verifyToken, userController.getAllUsers);
    userRouter.delete('/deleteaccaunt',authorization.getToken, authorization.verifyToken,authorization.getId, userController.deleteUser);

    return userRouter
}
