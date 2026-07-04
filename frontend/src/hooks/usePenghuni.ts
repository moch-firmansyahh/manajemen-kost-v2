import { useState, useEffect } from 'react';
import { Penghuni } from '@/types';
import { refetchPembayaranData } from './usePembayaran';
import { refetchKamarData } from './useKamar';

const API_URL = 'http://localhost:5000/api/penghuni';

export let globalDataPenghuni: Penghuni[] = [];
let listeners: React.Dispatch<React.SetStateAction<Penghuni[]>>[] = [];
let isFetched = false;
let globalIsLoading = true;

const notifyListeners = (data: Penghuni[]) => {
  globalDataPenghuni = data;
  globalIsLoading = false;
  listeners.forEach(listener => listener(data));
};

export const usePenghuni = () => {
  const [dataPenghuni, setDataPenghuni] = useState<Penghuni[]>(globalDataPenghuni);
  const [isLoading, setIsLoading] = useState<boolean>(globalIsLoading);

  useEffect(() => {
    listeners.push(setDataPenghuni);
    
    if (!isFetched) {
      setIsLoading(true);
      fetch(API_URL)
        .then(res => res.json())
        .then((data) => {
          isFetched = true;
          notifyListeners(data);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
    
    return () => {
      listeners = listeners.filter(l => l !== setDataPenghuni);
    };
  }, []);

  const getPenghuniById = (id: string) => globalDataPenghuni.find(p => p.id === id);

  const addPenghuni = async (penghuni: Omit<Penghuni, 'id' | 'createdAt'>) => {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(penghuni)
    });
    const newPenghuni = await res.json();
    notifyListeners([...globalDataPenghuni, newPenghuni]);
    await refetchKamarData();
    await refetchPembayaranData(); // Fetch the newly auto-generated Pembayaran
  };

  const updatePenghuni = async (id: string, updatedData: Partial<Penghuni>) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    });
    const updated = await res.json();
    notifyListeners(globalDataPenghuni.map(p => p.id === id ? updated : p));
    await refetchKamarData();
    await refetchPembayaranData();
  };

  const deletePenghuni = async (id: string) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    notifyListeners(globalDataPenghuni.filter(p => p.id !== id));
    await refetchKamarData();
    await refetchPembayaranData();
  };

  return {
    dataPenghuni,
    isLoading,
    getPenghuniById,
    addPenghuni,
    updatePenghuni,
    deletePenghuni,
  };
};
