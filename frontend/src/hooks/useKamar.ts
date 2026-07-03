import { useState, useEffect } from 'react';
import { Kamar } from '@/types';

const API_URL = 'http://localhost:5000/api/kamar';

export let globalDataKamar: Kamar[] = [];
let listeners: React.Dispatch<React.SetStateAction<Kamar[]>>[] = [];
let isFetched = false;
let globalIsLoading = true;

const notifyListeners = (data: Kamar[]) => {
  globalDataKamar = data;
  globalIsLoading = false;
  listeners.forEach(listener => listener(data));
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
    getKamarById,
    addKamar,
    updateKamar,
    deleteKamar,
  };
};
