import { Request, Response } from 'express';
import * as kamarService from '../services/kamar.service';

export const getKamar = async (req: Request, res: Response) => {
  try {
    const kamar = await kamarService.getKamar();
    res.json(kamar);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get kamar' });
  }
};

export const createKamar = async (req: Request, res: Response) => {
  try {
    const newKamar = await kamarService.createKamar(req.body);
    res.status(201).json(newKamar);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create kamar' });
  }
};

export const updateKamar = async (req: Request, res: Response) => {
  try {
    const updated = await kamarService.updateKamar(req.params.id as string, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update kamar' });
  }
};

export const deleteKamar = async (req: Request, res: Response) => {
  try {
    await kamarService.deleteKamar(req.params.id as string);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete kamar' });
  }
};
