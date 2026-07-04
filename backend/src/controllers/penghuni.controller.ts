import { Request, Response } from 'express';
import * as penghuniService from '../services/penghuni.service';

export const getPenghuni = async (req: Request, res: Response) => {
  try {
    const data = await penghuniService.getPenghuni();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get penghuni' });
  }
};

export const createPenghuni = async (req: Request, res: Response) => {
  try {
    const data = await penghuniService.createPenghuni(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create penghuni' });
  }
};

export const updatePenghuni = async (req: Request, res: Response) => {
  try {
    const updated = await penghuniService.updatePenghuni(req.params.id as string, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update penghuni' });
  }
};

export const deletePenghuni = async (req: Request, res: Response) => {
  try {
    await penghuniService.deletePenghuni(req.params.id as string);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete penghuni' });
  }
};
