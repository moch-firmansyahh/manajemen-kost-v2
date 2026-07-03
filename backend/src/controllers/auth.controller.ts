import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email dan password wajib diisi' });
      return;
    }

    // Cari admin berdasarkan email
    const admin = await prisma.admin.findUnique({
      where: { email }
    });

    if (!admin) {
      res.status(401).json({ error: 'Email belum terdaftar. Gunakan firmanajah366@gmail.com' });
      return;
    }

    // Karena di request mintanya "simple saja", kita cek password plain text
    if (admin.password !== password) {
      res.status(401).json({ error: 'Password salah' });
      return;
    }

    // Login sukses
    res.status(200).json({ message: 'Login berhasil', id: admin.id });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
};
