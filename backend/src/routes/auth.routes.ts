import { Router } from 'express';
import { login, getProfile, updateProfile, changePassword } from '../controllers/auth.controller';

const router = Router();

router.post('/login', login);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/profile/change-password', changePassword);

export default router;
