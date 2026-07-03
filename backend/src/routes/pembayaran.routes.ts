import { Router } from 'express';
import * as pembayaranController from '../controllers/pembayaran.controller';

const router = Router();

router.get('/', pembayaranController.getPembayaran);
router.post('/', pembayaranController.createPembayaran);
router.put('/:id', pembayaranController.updatePembayaran);
router.delete('/:id', pembayaranController.deletePembayaran);
router.post('/bulk', pembayaranController.generateTagihanBulk);

export default router;
