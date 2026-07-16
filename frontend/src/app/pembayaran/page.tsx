"use client";

import { useState } from "react";
import { usePembayaran } from "@/hooks/usePembayaran";
import { usePenghuni } from "@/hooks/usePenghuni";
import { useKamar } from "@/hooks/useKamar";
import { PembayaranTable } from "@/components/pembayaran/PembayaranTable";
import { PembayaranForm } from "@/components/pembayaran/PembayaranForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Filter, Calendar, AlertCircle, Search } from "lucide-react";
import { Pembayaran, StatusPembayaran } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Halaman utama Manajemen Pembayaran Kost
export default function PembayaranPage() {
  const { dataPembayaran, tambahPembayaran, perbaruiPembayaran, hapusPembayaran, isLoading: loadingPembayaran, error: errorPembayaran } = usePembayaran();
  const { dataPenghuni, isLoading: loadingPenghuni, error: errorPenghuni } = usePenghuni();
  const { dataKamar, isLoading: loadingKamar, error: errorKamar } = useKamar();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingData, setEditingData] = useState<Pembayaran | null>(null);
  const [filterStatus, setFilterStatus] = useState<StatusPembayaran | "semua">("semua");
  const [searchQuery, setSearchQuery] = useState("");
  
  const currentYear = new Date().getFullYear().toString();
  const [filterTahun, setFilterTahun] = useState<string>(currentYear);

  const isLoading = loadingPembayaran || loadingPenghuni || loadingKamar;
  const error = errorPembayaran || errorPenghuni || errorKamar;

  // Membuat daftar pilihan tahun pembayaran dari data yang ada
  const availableYears = Array.from(
    new Set([currentYear, ...dataPembayaran.map(p => p.tahun.toString())])
  ).sort((a, b) => parseInt(b) - parseInt(a));

  // Melakukan filter data pembayaran bulanan berdasarkan pencarian, tahun, dan status
  const filteredData = dataPembayaran.filter(p => {
    // 1. Dapatkan data penghuni terkait
    const penghuni = dataPenghuni.find(pengh => pengh.id === p.penghuniId);
    
    // 2. Sembunyikan riwayat pembayaran penghuni yang sudah keluar
    const isAktif = penghuni && !penghuni.tanggalKeluar;
    if (!isAktif) return false;

    // 3. Filter berdasarkan Kolom Pencarian Nama Penghuni
    if (searchQuery.trim() !== "") {
      const namaCocok = penghuni.nama.toLowerCase().includes(searchQuery.toLowerCase());
      if (!namaCocok) return false;
    }
    
    // 4. Filter berdasarkan Tahun agar tidak terlalu panjang/melebar
    if (filterTahun !== "semua" && p.tahun.toString() !== filterTahun) return false;

    // 5. Filter berdasarkan Status Pembayaran
    if (filterStatus !== "semua" && p.status !== filterStatus) return false;

    return true;
  });

  // Menangani aksi edit pembayaran
  const handleEdit = (pembayaran: Pembayaran) => {
    setEditingData(pembayaran);
    setIsFormOpen(true);
  };

  // Menutup dialog formulir tambah/edit pembayaran
  const handleTutupForm = () => {
    setIsFormOpen(false);
    setEditingData(null);
  };

  // Menangani pengiriman data formulir (tambah/edit)
  const handleKirim = (data: Omit<Pembayaran, "id" | "createdAt">) => {
    if (editingData) {
      perbaruiPembayaran(editingData.id, data);
    } else {
      tambahPembayaran(data);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-muted rounded w-28"></div>
          <div className="h-8 bg-muted rounded w-36"></div>
        </div>
        <div className="flex gap-4">
          <div className="h-10 bg-muted rounded w-48"></div>
          <div className="h-10 bg-muted rounded w-48"></div>
        </div>
        <div className="h-64 bg-muted rounded-xl"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive animate-bounce" />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-destructive">Gagal Memuat Data Pembayaran</h3>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Pembayaran</h1>
        </div>
        <Button 
          onClick={() => setIsFormOpen(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          Catat Pembayaran
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
          {/* Filter Status Bayar */}
          <div className="flex items-center gap-2 w-full sm:max-w-[200px]">
            <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <Select 
              value={filterStatus} 
              onValueChange={(value) => setFilterStatus(value as StatusPembayaran | "semua")}
            >
              <SelectTrigger className="bg-background border-border w-full">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">Semua Status</SelectItem>
                <SelectItem value="lunas">Lunas</SelectItem>
                <SelectItem value="belum_bayar">Belum Bayar</SelectItem>
                <SelectItem value="terlambat">Terlambat</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filter Tahun */}
          <div className="flex items-center gap-2 w-full sm:max-w-[200px]">
            <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <Select 
              value={filterTahun} 
              onValueChange={setFilterTahun}
            >
              <SelectTrigger className="bg-background border-border w-full">
                <SelectValue placeholder="Filter Tahun" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">Semua Tahun</SelectItem>
                {availableYears.map(year => (
                  <SelectItem key={year} value={year}>Tahun {year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Kolom Pencarian Nama Penghuni */}
        <div className="flex items-center w-full lg:max-w-sm relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Cari nama penghuni..." 
            className="pl-10 bg-background border-border focus-visible:ring-primary w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <PembayaranTable 
        data={filteredData} 
        dataPenghuni={dataPenghuni}
        dataKamar={dataKamar}
        onEdit={handleEdit} 
        onDelete={hapusPembayaran} 
      />

      <PembayaranForm
        isOpen={isFormOpen}
        onClose={handleTutupForm}
        onSubmit={handleKirim}
        initialData={editingData}
        dataPenghuni={dataPenghuni}
        dataKamar={dataKamar}
      />
    </div>
  );
}
