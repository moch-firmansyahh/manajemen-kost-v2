import { useState, useEffect } from 'react';
import { Penghuni } from '@/types';

const DUMMY_PENGHUNI: Penghuni[] = [
  {
    id: "1",
    nama: "Budi Santoso",
    nik: "3201010101010001",
    noTelepon: "081234567890",
    email: "budi@example.com",
    kamarId: "1",
    tanggalMasuk: "2026-03-01T00:00:00.000Z",
    tanggalKeluar: null,
    createdAt: "2026-03-01T00:00:00.000Z",
  }
];

export let globalDataPenghuni = [...DUMMY_PENGHUNI];
let listeners: React.Dispatch<React.SetStateAction<Penghuni[]>>[] = [];

const notifyListeners = (data: Penghuni[]) => {
  globalDataPenghuni = data;
  listeners.forEach(listener => listener(data));
};

export const usePenghuni = () => {
  const [dataPenghuni, setDataPenghuni] = useState<Penghuni[]>(globalDataPenghuni);

  useEffect(() => {
    setDataPenghuni([...globalDataPenghuni]);
    listeners.push(setDataPenghuni);
    return () => {
      listeners = listeners.filter(l => l !== setDataPenghuni);
    };
  }, []);

  const getPenghuniById = (id: string) => globalDataPenghuni.find(p => p.id === id);

  const addPenghuni = (penghuni: Omit<Penghuni, 'id' | 'createdAt'>) => {
    const newPenghuni: Penghuni = {
      ...penghuni,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    notifyListeners([...globalDataPenghuni, newPenghuni]);
  };

  const updatePenghuni = (id: string, updatedData: Partial<Penghuni>) => {
    notifyListeners(globalDataPenghuni.map(p => p.id === id ? { ...p, ...updatedData } : p));
  };

  const deletePenghuni = (id: string) => {
    notifyListeners(globalDataPenghuni.filter(p => p.id !== id));
  };

  return {
    dataPenghuni,
    getPenghuniById,
    addPenghuni,
    updatePenghuni,
    deletePenghuni,
  };
};
