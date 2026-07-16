import { useState, useEffect } from 'react';
import { Kamar } from '@/types';
import { API_BASE_URL } from '@/lib/utils';

const API_URL = `${API_BASE_URL}/api/kamar`;

export let globalDataKamar: Kamar[] = [];
let listeners: React.Dispatch<React.SetStateAction<Kamar[]>>[] = [];
let isFetched = false;
let globalIsLoading = true;

const sortKamarList = (list: Kamar[]) => {
  return [...list].sort((a, b) => {
    return a.nomorKamar.localeCompare(b.nomorKamar, undefined, { numeric: true, sensitivity: 'base' });
  });
};

const notifyListeners = (data: Kamar[]) => {
  globalDataKamar = sortKamarList(data);
  globalIsLoading = false;
  listeners.forEach(listener => listener(globalDataKamar));
};

export const refetchKamarData = async () => {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    isFetched = true;
    notifyListeners(data);
  } catch (e) {
    console.error("Failed to fetch kamar", e);
  }
};

export const useKamar = () => {
  const [dataKamar, setDataKamar] = useState<Kamar[]>(globalDataKamar);
  const [isLoading, setIsLoading] = useState<boolean>(globalIsLoading);

  useEffect(() => {
    listeners.push(setDataKamar);
    
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
      listeners = listeners.filter(l => l !== setDataKamar);
    };
  }, []);

  const getKamarById = (id: string) => globalDataKamar.find(k => k.id === id);

  const addKamar = async (kamar: Omit<Kamar, 'id' | 'createdAt'>) => {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(kamar)
    });
    const newKamar = await res.json();
    notifyListeners([...globalDataKamar, newKamar]);
  };

  const updateKamar = async (id: string, updatedData: Partial<Kamar>) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    });
    const updated = await res.json();
    notifyListeners(globalDataKamar.map(k => k.id === id ? updated : k));
  };

  const deleteKamar = async (id: string) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    notifyListeners(globalDataKamar.filter(k => k.id !== id));
  };

  return {
    dataKamar,
    isLoading,
    error: null,
    getKamarById,
    addKamar,
    updateKamar,
    deleteKamar,
    ambilKamarSesuaiId: getKamarById,
    tambahKamar: addKamar,
    perbaruiKamar: updateKamar,
    hapusKamar: deleteKamar,
    refresh: refetchKamarData,
  };
};
