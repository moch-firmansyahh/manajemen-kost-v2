import { Router } from 'express';
import * as penghuniController from '../controllers/penghuni.controller';

const router = Router();

router.get('/', penghuniController.getPenghuni);
router.post('/', penghuniController.createPenghuni);
router.put('/:id', penghuniController.updatePenghuni);
router.delete('/:id', penghuniController.deletePenghuni);

export default router;
