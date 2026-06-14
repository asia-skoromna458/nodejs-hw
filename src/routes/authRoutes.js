import { Router } from 'express';
import { celebrate } from 'celebrate';
import { loginUserSchema, registerUserSchema } from '../validations/authValidation';
import { loginUser, logoutUser, refreshUserSession, registerUser } from '../controllers/authController';

const router = Router();

router.post('auth/register', celebrate(registerUserSchema), registerUser);
router.post('auth/login', celebrate(loginUserSchema), loginUser);
router.post('auth/refresh', celebrate(refreshUserSession));
router.post('auth/logout', celebrate(logoutUser));
export default router;
