import { useState, useEffect } from 'react';
import { Kamar } from '@/types';

const DUMMY_KAMAR: Kamar[] = [
  {
    id: "1",
    nomorKamar: "101",
    lantai: 1,
    tipe: "Standard",
    hargaPerBulan: 800000,
    fasilitas: ["Kasur", "Lemari", "Kipas Angin", "Kamar Mandi Luar"],
    status: "terisi",
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    nomorKamar: "102",
    lantai: 1,
    tipe: "Deluxe",
    hargaPerBulan: 1200000,
    fasilitas: ["Kasur", "Lemari", "AC", "WiFi", "Kamar Mandi Dalam"],
    status: "tersedia",
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "3",
    nomorKamar: "201",
    lantai: 2,
    tipe: "VIP",
    hargaPerBulan: 1500000,
    fasilitas: ["Kasur Springbed", "Lemari", "AC", "WiFi", "TV", "Kamar Mandi Dalam", "Water Heater"],
    status: "maintenance",
    createdAt: "2024-01-01T00:00:00.000Z",
  }
];

// Global state to persist data across page navigation during development
export let globalDataKamar = [...DUMMY_KAMAR];
let listeners: React.Dispatch<React.SetStateAction<Kamar[]>>[] = [];

const notifyListeners = (data: Kamar[]) => {
  globalDataKamar = data;
  listeners.forEach(listener => listener(data));
};

export const useKamar = () => {
  const [dataKamar, setDataKamar] = useState<Kamar[]>(globalDataKamar);

  useEffect(() => {
    setDataKamar([...globalDataKamar]);
    listeners.push(setDataKamar);
    return () => {
      listeners = listeners.filter(l => l !== setDataKamar);
    };
  }, []);

  const getKamarById = (id: string) => globalDataKamar.find(k => k.id === id);

  const addKamar = (kamar: Omit<Kamar, 'id' | 'createdAt'>) => {
    const newKamar: Kamar = {
      ...kamar,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    notifyListeners([...globalDataKamar, newKamar]);
  };

  const updateKamar = (id: string, updatedData: Partial<Kamar>) => {
    notifyListeners(globalDataKamar.map(k => k.id === id ? { ...k, ...updatedData } : k));
  };

  const deleteKamar = (id: string) => {
    notifyListeners(globalDataKamar.filter(k => k.id !== id));
  };

  return {
    dataKamar,
    getKamarById,
    addKamar,
    updateKamar,
    deleteKamar,
  };
};
