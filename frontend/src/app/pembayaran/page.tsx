"use client";

import { useState } from "react";
import { usePembayaran } from "@/hooks/usePembayaran";
import { usePenghuni } from "@/hooks/usePenghuni";
import { useKamar } from "@/hooks/useKamar";
import { PembayaranTable } from "@/components/pembayaran/PembayaranTable";
import { PembayaranForm } from "@/components/pembayaran/PembayaranForm";
import { Button } from "@/components/ui/button";
import { Plus, Filter, Calendar } from "lucide-react";
import { Pembayaran, StatusPembayaran } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function PembayaranPage() {
  const { dataPembayaran, isLoading, addPembayaran, updatePembayaran, deletePembayaran } = usePembayaran();
  const { dataPenghuni } = usePenghuni();
  const { dataKamar } = useKamar();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingData, setEditingData] = useState<Pembayaran | null>(null);
  const [filterStatus, setFilterStatus] = useState<StatusPembayaran | "semua">("semua");
  
  const currentYear = new Date().getFullYear().toString();
  const [filterTahun, setFilterTahun] = useState<string>(currentYear);

  // Generate list of available years from data, plus current year
  const availableYears = Array.from(
    new Set([currentYear, ...dataPembayaran.map(p => p.tahun.toString())])
  ).sort((a, b) => parseInt(b) - parseInt(a));

  const filteredData = dataPembayaran.filter(p => {
    // 1. Sembunyikan riwayat pembayaran penghuni yang sudah keluar
    const penghuni = dataPenghuni.find(pengh => pengh.id === p.penghuniId);
    const isAktif = penghuni && !penghuni.tanggalKeluar;
    if (!isAktif) return false;
    
    // 2. Filter berdasarkan Tahun agar tidak terlalu panjang/melebar
    if (filterTahun !== "semua" && p.tahun.toString() !== filterTahun) return false;

    // 3. Filter berdasarkan Status
    if (filterStatus !== "semua" && p.status !== filterStatus) return false;

    return true;
  });

  const handleEdit = (pembayaran: Pembayaran) => {
    setEditingData(pembayaran);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingData(null);
  };

  const handleSubmit = (data: Omit<Pembayaran, "id" | "createdAt">) => {
    if (editingData) {
      updatePembayaran(editingData.id, data);
    } else {
      addPembayaran(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Pembayaran</h1>
        </div>
        <Button 
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          Catat Pembayaran
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
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

      {isLoading ? (
        <div className="space-y-4 mt-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : (
        <PembayaranTable 
          data={filteredData} 
          dataPenghuni={dataPenghuni}
          dataKamar={dataKamar}
          onEdit={handleEdit} 
          onDelete={deletePembayaran} 
        />
      )}

      <PembayaranForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        initialData={editingData}
        dataPenghuni={dataPenghuni}
        dataKamar={dataKamar}
      />
    </div>
  );
}
