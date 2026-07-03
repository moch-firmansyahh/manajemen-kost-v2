import { Request, Response } from 'express';
import * as pembayaranService from '../services/pembayaran.service';

export const getPembayaran = async (req: Request, res: Response) => {
  try {
    const data = await pembayaranService.getPembayaran();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get pembayaran' });
  }
};

export const createPembayaran = async (req: Request, res: Response) => {
  try {
    const data = await pembayaranService.createPembayaran(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create pembayaran' });
  }
};

export const updatePembayaran = async (req: Request, res: Response) => {
  try {
    const updated = await pembayaranService.updatePembayaran(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update pembayaran' });
  }
};

export const deletePembayaran = async (req: Request, res: Response) => {
  try {
    await pembayaranService.deletePembayaran(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete pembayaran' });
  }
};

export const generateTagihanBulk = async (req: Request, res: Response) => {
  try {
    const count = await pembayaranService.generateTagihanBulk(req.body.data);
    res.status(201).json(count);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate tagihan' });
  }
};
