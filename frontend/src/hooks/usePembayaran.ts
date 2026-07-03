import { useState, useEffect } from 'react';
import { Pembayaran } from '@/types';
import { globalDataPenghuni } from './usePenghuni';

const API_URL = 'http://localhost:5000/api/pembayaran';

export let globalDataPembayaran: Pembayaran[] = [];
let listeners: React.Dispatch<React.SetStateAction<Pembayaran[]>>[] = [];
let isFetched = false;
let globalIsLoading = true;

const notifyListeners = (data: Pembayaran[]) => {
  globalDataPembayaran = data;
  globalIsLoading = false;
  listeners.forEach(listener => listener(data));
};

export const refetchPembayaranData = async () => {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    isFetched = true;
    notifyListeners(data);
  } catch (e) {
    console.error("Failed to fetch pembayaran", e);
  }
};

export const usePembayaran = () => {
  const [dataPembayaran, setDataPembayaran] = useState<Pembayaran[]>(globalDataPembayaran);
  const [isLoading, setIsLoading] = useState<boolean>(globalIsLoading);

  useEffect(() => {
    listeners.push(setDataPembayaran);
    
    if (!isFetched) {
      refetchPembayaranData();
    } else {
      setIsLoading(false);
    }
    
    return () => {
      listeners = listeners.filter(l => l !== setDataPembayaran);
    };
  }, []);

  const getPembayaranById = (id: string) => globalDataPembayaran.find(p => p.id === id);

  const addPembayaran = async (pembayaran: Omit<Pembayaran, 'id' | 'createdAt'>) => {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pembayaran)
    });
    const newPembayaran = await res.json();
    notifyListeners([...globalDataPembayaran, newPembayaran]);
  };

  const updatePembayaran = async (id: string, updatedData: Partial<Pembayaran>) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    });
    const updated = await res.json();
    notifyListeners(globalDataPembayaran.map(p => p.id === id ? updated : p));
  };

  const deletePembayaran = async (id: string) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    notifyListeners(globalDataPembayaran.filter(p => p.id !== id));
  };

  return {
    dataPembayaran,
    isLoading,
    getPembayaranById,
    addPembayaran,
    updatePembayaran,
    deletePembayaran,
  };
};

export const autoGenerateTagihan = async () => {
  if (!isFetched) return;

  const currentMonth = new Date().toLocaleString('id-ID', { month: 'long' });
  const currentYear = new Date().getFullYear();
  
  const penghuniAktif = globalDataPenghuni.filter(p => !p.tanggalKeluar);
  
  const newTagihan: Omit<Pembayaran, 'id' | 'createdAt'>[] = [];
  
  penghuniAktif.forEach(penghuni => {
    const existingTagihan = globalDataPembayaran.find(
      p => p.penghuniId === penghuni.id && p.bulan === currentMonth && p.tahun === currentYear
    );

    if (!existingTagihan) {
      newTagihan.push({
        penghuniId: penghuni.id,
        kamarId: penghuni.kamarId,
        bulan: currentMonth,
        tahun: currentYear,
        jumlah: 800000,
        tanggalBayar: null,
        status: 'belum_bayar'
      });
    }
  });

  if (newTagihan.length > 0) {
    await fetch(`${API_URL}/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: newTagihan })
    });
    
    // Refetch all to update UI
    const res = await fetch(API_URL);
    const updatedData = await res.json();
    notifyListeners(updatedData);
  }
};
