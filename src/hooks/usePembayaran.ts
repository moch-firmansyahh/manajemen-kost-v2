import { useState, useEffect } from 'react';
import { Pembayaran } from '@/types';
import { globalDataPenghuni } from './usePenghuni';
import { globalDataKamar } from './useKamar';

const DUMMY_PEMBAYARAN: Pembayaran[] = [];

let globalDataPembayaran = [...DUMMY_PEMBAYARAN];
let listeners: React.Dispatch<React.SetStateAction<Pembayaran[]>>[] = [];

const notifyListeners = (data: Pembayaran[]) => {
  globalDataPembayaran = data;
  listeners.forEach(listener => listener(data));
};

export const autoGenerateTagihan = () => {
  const namaBulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const now = new Date();
  
  let isModified = false;
  
  globalDataPenghuni.forEach(penghuni => {
    if (penghuni.tanggalKeluar) return; // Skip inactive tenants
    
    const kamar = globalDataKamar.find(k => k.id === penghuni.kamarId);
    if (!kamar) return;
    
    const masukDate = new Date(penghuni.tanggalMasuk);
    const dueDay = masukDate.getDate(); // Jatuh tempo = tanggal masuk
    
    // Mulai tagihan otomatis 1 bulan setelah tanggal masuk
    let currDate = new Date(masukDate.getFullYear(), masukDate.getMonth() + 1, 1);
    
    // Target = bulan depan (supaya tagihan bulan depan sudah muncul)
    const targetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    
    while (currDate <= targetDate) {
      const bulanIndex = currDate.getMonth();
      const bulan = namaBulan[bulanIndex];
      const tahun = currDate.getFullYear();
      
      let bill = globalDataPembayaran.find(p => p.penghuniId === penghuni.id && p.bulan === bulan && p.tahun === tahun);
      
      if (!bill) {
        // Create missing bill automatically
        bill = {
          id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
          penghuniId: penghuni.id,
          kamarId: kamar.id,
          bulan,
          tahun,
          jumlah: kamar.hargaPerBulan,
          tanggalBayar: null,
          status: "belum_bayar",
          createdAt: new Date().toISOString()
        };
        globalDataPembayaran.push(bill);
        isModified = true;
      }
      
      // Cek apakah status perlu diubah menjadi 'terlambat'
      if (bill.status === "belum_bayar" || bill.status === "terlambat") {
        const dueDate = new Date(tahun, bulanIndex, dueDay);
        // Tambahkan toleransi waktu (akhir hari due date)
        dueDate.setHours(23, 59, 59, 999);
        
        if (now > dueDate && bill.status !== "terlambat") {
          bill.status = "terlambat";
          isModified = true;
        } else if (now <= dueDate && bill.status === "terlambat") {
          bill.status = "belum_bayar";
          isModified = true;
        }
      }
      
      currDate.setMonth(currDate.getMonth() + 1);
    }
  });

  if (isModified) {
    notifyListeners([...globalDataPembayaran]);
  }
};

export const usePembayaran = () => {
  const [dataPembayaran, setDataPembayaran] = useState<Pembayaran[]>(globalDataPembayaran);

  useEffect(() => {
    setDataPembayaran([...globalDataPembayaran]);
    listeners.push(setDataPembayaran);
    return () => {
      listeners = listeners.filter(l => l !== setDataPembayaran);
    };
  }, []);

  const getPembayaranById = (id: string) => globalDataPembayaran.find(p => p.id === id);

  const addPembayaran = (pembayaran: Omit<Pembayaran, 'id' | 'createdAt'>) => {
    const newPembayaran: Pembayaran = {
      ...pembayaran,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    notifyListeners([...globalDataPembayaran, newPembayaran]);
  };

  const updatePembayaran = (id: string, updatedData: Partial<Pembayaran>) => {
    notifyListeners(globalDataPembayaran.map(p => p.id === id ? { ...p, ...updatedData } : p));
  };

  const deletePembayaran = (id: string) => {
    notifyListeners(globalDataPembayaran.filter(p => p.id !== id));
  };

  const deletePembayaranByPenghuniId = (penghuniId: string) => {
    notifyListeners(globalDataPembayaran.filter(p => p.penghuniId !== penghuniId));
  };

  return {
    dataPembayaran,
    getPembayaranById,
    addPembayaran,
    updatePembayaran,
    deletePembayaran,
    deletePembayaranByPenghuniId,
  };
};
