"use client";

import { useState } from "react";
import { usePenghuni } from "@/hooks/usePenghuni";
import { useKamar } from "@/hooks/useKamar";
import { usePembayaran } from "@/hooks/usePembayaran";
import { PenghuniTable } from "@/components/penghuni/PenghuniTable";
import { PenghuniForm } from "@/components/penghuni/PenghuniForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, AlertCircle, ArrowUpDown } from "lucide-react";
import { Penghuni } from "@/types";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Halaman utama Manajemen Penghuni Kost
export default function PenghuniPage() {
  const { dataPenghuni, tambahPenghuni, perbaruiPenghuni, hapusPenghuni, isLoading: loadingPenghuni, error: errorPenghuni } = usePenghuni();
  const { dataKamar, perbaruiKamar, isLoading: loadingKamar, error: errorKamar } = useKamar();
  const { hapusPembayaranSesuaiIdPenghuni } = usePembayaran();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingData, setEditingData] = useState<Penghuni | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"aktif" | "alumni">("aktif");
  const [urutanWaktu, setUrutanWaktu] = useState<"terbaru" | "terlama">("terbaru");

  const isLoading = loadingPenghuni || loadingKamar;
  const error = errorPenghuni || errorKamar;

  // Filter dan urutkan data penghuni berdasarkan pencarian, tab aktif, dan urutan tanggal masuk
  const filteredData = dataPenghuni
    .filter(p => {
      const matchName = p.nama.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = activeTab === "aktif" ? !p.tanggalKeluar : !!p.tanggalKeluar;
      return matchName && matchStatus;
    })
    .sort((a, b) => {
      const timeA = new Date(a.tanggalMasuk).getTime();
      const timeB = new Date(b.tanggalMasuk).getTime();
      return urutanWaktu === "terbaru" ? timeB - timeA : timeA - timeB;
    });

  // Menangani aksi edit penghuni
  const handleEdit = (penghuni: Penghuni) => {
    setEditingData(penghuni);
    setIsFormOpen(true);
  };

  // Menutup dialog formulir tambah/edit penghuni
  const handleTutupForm = () => {
    setIsFormOpen(false);
    setEditingData(null);
  };

  // Menangani proses checkout penghuni (keluar dari kost)
  const handleCheckout = (id: string) => {
    const penghuni = dataPenghuni.find(p => p.id === id);
    if (penghuni && !penghuni.tanggalKeluar) {
      perbaruiPenghuni(id, { tanggalKeluar: new Date().toISOString() });
      perbaruiKamar(penghuni.kamarId, { status: "tersedia" });
    }
  };

  // Menangani pengiriman data formulir tambah/edit penghuni
  const handleKirim = (data: Omit<Penghuni, "id" | "createdAt">) => {
    if (editingData) {
      perbaruiPenghuni(editingData.id, data);
      // Jika kamar berubah, ubah status kamar lama jadi tersedia, kamar baru jadi terisi
      if (editingData.kamarId !== data.kamarId) {
        perbaruiKamar(editingData.kamarId, { status: "tersedia" });
        perbaruiKamar(data.kamarId, { status: "terisi" });
      } else if (data.tanggalKeluar) {
        // Jika diatur tanggal keluar, kamarnya jadi tersedia
        perbaruiKamar(data.kamarId, { status: "tersedia" });
      } else {
        perbaruiKamar(data.kamarId, { status: "terisi" });
      }
    } else {
      tambahPenghuni(data);
      // Otomatis ubah status kamar menjadi terisi
      perbaruiKamar(data.kamarId, { status: "terisi" });
    }
  };

  // Menangani penghapusan data penghuni beserta riwayat pembayarannya
  const handleHapus = (id: string) => {
    const penghuni = dataPenghuni.find(p => p.id === id);
    if (penghuni) {
      perbaruiKamar(penghuni.kamarId, { status: "tersedia" });
    }
    hapusPenghuni(id);
    hapusPembayaranSesuaiIdPenghuni(id); // Hapus otomatis tagihan yang berelasi
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-muted rounded w-28"></div>
          <div className="h-8 bg-muted rounded w-36"></div>
        </div>
        <div className="h-10 bg-muted rounded w-48"></div>
        <div className="h-64 bg-muted rounded-xl"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive animate-bounce" />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-destructive">Gagal Memuat Data Penghuni</h3>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Penghuni</h1>
        </div>
        <Button 
          onClick={() => setIsFormOpen(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          Tambah Penghuni
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
          {/* Tab Filter Status Keaktifan */}
          <div className="flex bg-muted p-1 rounded-lg w-fit">
            <button 
              onClick={() => setActiveTab("aktif")}
              className={cn("px-4 py-1.5 text-sm font-medium rounded-md transition-all", activeTab === "aktif" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              Aktif
            </button>
            <button 
              onClick={() => setActiveTab("alumni")}
              className={cn("px-4 py-1.5 text-sm font-medium rounded-md transition-all", activeTab === "alumni" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              Penghuni yang Keluar
            </button>
          </div>

          {/* Filter Urut Tanggal */}
          <div className="flex items-center gap-2 w-full sm:max-w-[200px]">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <Select 
              value={urutanWaktu} 
              onValueChange={(value) => setUrutanWaktu(value as "terbaru" | "terlama")}
            >
              <SelectTrigger className="bg-background border-border w-full">
                <SelectValue placeholder="Urutkan Tanggal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="terbaru">Terbaru ke Terlama</SelectItem>
                <SelectItem value="terlama">Terlama ke Terbaru</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Kolom Pencarian */}
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

      <PenghuniTable 
        data={filteredData} 
        dataKamar={dataKamar}
        onEdit={handleEdit} 
        onCheckout={handleCheckout}
        onDelete={handleHapus} 
      />

      <PenghuniForm
        isOpen={isFormOpen}
        onClose={handleTutupForm}
        onSubmit={handleKirim}
        initialData={editingData}
        dataKamar={dataKamar}
      />
    </div>
  );
}
