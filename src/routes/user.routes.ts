import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/me', authMiddleware, (req, res) => {
  return res.json({
    id: req.user.id,
    email: req.user.email,
  })
})

export default router;
