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

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const admin = await prisma.admin.findFirst();
    if (!admin) {
      res.status(404).json({ error: 'Profile tidak ditemukan' });
      return;
    }
    res.status(200).json({ id: admin.id, nama: admin.nama, email: admin.email });
  } catch (error) {
    console.error('getProfile error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nama, email } = req.body;
    if (!nama || !email) {
      res.status(400).json({ error: 'Nama dan email wajib diisi' });
      return;
    }

    const admin = await prisma.admin.findFirst();
    if (!admin) {
      res.status(404).json({ error: 'Profile tidak ditemukan' });
      return;
    }

    const updated = await prisma.admin.update({
      where: { id: admin.id },
      data: { nama, email }
    });

    res.status(200).json({ id: updated.id, nama: updated.nama, email: updated.email });
  } catch (error) {
    console.error('updateProfile error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
};

export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: 'Kata sandi saat ini dan kata sandi baru wajib diisi' });
      return;
    }

    const admin = await prisma.admin.findFirst();
    if (!admin) {
      res.status(404).json({ error: 'Profile tidak ditemukan' });
      return;
    }

    if (admin.password !== currentPassword) {
      res.status(400).json({ error: 'Kata sandi saat ini salah' });
      return;
    }

    const updated = await prisma.admin.update({
      where: { id: admin.id },
      data: { password: newPassword }
    });

    res.status(200).json({ message: 'Kata sandi berhasil diperbarui' });
  } catch (error) {
    console.error('changePassword error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
};
