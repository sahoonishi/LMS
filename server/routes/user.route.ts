import express from 'express';
import { activateUser, getUserInfo, loginUser, logoutUser, registrationUser, socialAuth, UpdateAccesstoken, updateInfo, updatePassword, updateProfilepic } from '../controllers/user.controller';
import { isAuth } from '../middleware/isAuth';

const userRouter = express.Router();
userRouter.post('/register', registrationUser);
userRouter.post('/activateuser', activateUser);
userRouter.post('/login', loginUser);
userRouter.get('/logout',isAuth, logoutUser);
userRouter.get('/refreshtoken',UpdateAccesstoken);
userRouter.get('/getuserinfo',isAuth,getUserInfo);
userRouter.post('/social',socialAuth);
userRouter.put('/updateuser' , isAuth , updateInfo);
userRouter.put('/updatepassword' , isAuth , updatePassword);
userRouter.put('/updateprofilepic' , isAuth , updateProfilepic);
export default userRouter;
