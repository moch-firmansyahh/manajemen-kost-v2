"use client";

import { useState } from "react";
import { useKamar } from "@/hooks/useKamar";
import { KamarTable } from "@/components/kamar/KamarTable";
import { KamarForm } from "@/components/kamar/KamarForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Filter, AlertCircle, Search } from "lucide-react";
import { Kamar, StatusKamar } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Halaman utama Daftar Kamar Kost
export default function KamarPage() {
  const { dataKamar, tambahKamar, perbaruiKamar, hapusKamar, isLoading, error } = useKamar();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingData, setEditingData] = useState<Kamar | null>(null);
  const [filterStatus, setFilterStatus] = useState<StatusKamar | "semua">("semua");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter data kamar sesuai status dan pencarian nomor/tipe kamar yang dipilih
  const filteredData = dataKamar.filter(k => {
    // 1. Saring berdasarkan status kamar
    if (filterStatus !== "semua" && k.status !== filterStatus) return false;
    
    // 2. Saring berdasarkan kolom pencarian (nomor kamar atau tipe kamar)
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      const nomorCocok = k.nomorKamar.toLowerCase().includes(query);
      const tipeCocok = k.tipe.toLowerCase().includes(query);
      if (!nomorCocok && !tipeCocok) return false;
    }
    
    return true;
  });

  // Menangani aksi edit kamar
  const handleEdit = (kamar: Kamar) => {
    setEditingData(kamar);
    setIsFormOpen(true);
  };

  // Menutup dialog formulir tambah/edit kamar
  const handleTutupForm = () => {
    setIsFormOpen(false);
    setEditingData(null);
  };

  // Menangani pengiriman data formulir (tambah/edit)
  const handleKirim = (data: Omit<Kamar, "id" | "createdAt">) => {
    if (editingData) {
      perbaruiKamar(editingData.id, data);
    } else {
      tambahKamar(data);
    }
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
          <h3 className="text-lg font-semibold text-destructive">Gagal Memuat Data Kamar</h3>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Kamar</h1>
        </div>
        <Button 
          onClick={() => setIsFormOpen(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          Tambah Kamar
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Filter Status Kamar */}
        <div className="flex items-center gap-2 w-full sm:max-w-[200px]">
          <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <Select 
            value={filterStatus} 
            onValueChange={(value) => setFilterStatus(value as StatusKamar | "semua")}
          >
            <SelectTrigger className="bg-background border-border w-full">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua Status</SelectItem>
              <SelectItem value="tersedia">Tersedia</SelectItem>
              <SelectItem value="terisi">Terisi</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Kolom Pencarian Nomor / Tipe Kamar */}
        <div className="flex items-center w-full sm:max-w-sm relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Cari nomor atau tipe kamar..." 
            className="pl-10 bg-background border-border focus-visible:ring-primary w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <KamarTable 
        data={filteredData} 
        onEdit={handleEdit} 
        onDelete={hapusKamar} 
      />

      <KamarForm
        isOpen={isFormOpen}
        onClose={handleTutupForm}
        onSubmit={handleKirim}
        initialData={editingData}
      />
    </div>
  );
}
