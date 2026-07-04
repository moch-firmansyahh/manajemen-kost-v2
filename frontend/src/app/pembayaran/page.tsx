"use client";

import { useState } from "react";
import { usePembayaran } from "@/hooks/usePembayaran";
import { usePenghuni } from "@/hooks/usePenghuni";
import { useKamar } from "@/hooks/useKamar";
import { PembayaranTable } from "@/components/pembayaran/PembayaranTable";
import dynamic from "next/dynamic";
const PembayaranForm = dynamic(() => import("@/components/pembayaran/PembayaranForm").then(mod => mod.PembayaranForm), { ssr: false });
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
  const [hasMountedForm, setHasMountedForm] = useState(false);
  const [editingData, setEditingData] = useState<Pembayaran | null>(null);
  const [filterStatus, setFilterStatus] = useState<StatusPembayaran | "semua">("semua");
  
  const currentYear = new Date().getFullYear().toString();
  const [filterTahun, setFilterTahun] = useState<string>(currentYear);

  // Generate list of available years from data, plus current year
  const availableYears = Array.from(
    new Set([currentYear, ...dataPembayaran.map(p => p.tahun.toString())])
  ).sort((a, b) => parseInt(b) - parseInt(a));

  const filteredData = dataPembayaran.filter(p => {
    // 1. Logika filter penghuni keluar
    const penghuni = dataPenghuni.find(pengh => pengh.id === p.penghuniId);
    const isAktif = penghuni && !penghuni.tanggalKeluar;
    
    if (!isAktif) {
      // Jika penghuni sudah keluar, HANYA sembunyikan tagihan yang sudah Lunas.
      // Jika tagihan masih Belum Bayar atau Terlambat, TETAP tampilkan.
      if (p.status === "lunas") {
        return false;
      }
    }
    
    // 2. Filter berdasarkan Tahun agar tidak terlalu panjang/melebar
    if (filterTahun !== "semua" && p.tahun.toString() !== filterTahun) return false;

    // 3. Filter berdasarkan Status
    if (filterStatus !== "semua" && p.status !== filterStatus) return false;

    return true;
  });

  const handleEdit = (pembayaran: Pembayaran) => {
    setEditingData(pembayaran);
    setHasMountedForm(true);
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
          onClick={() => {
            setHasMountedForm(true);
            setIsFormOpen(true);
          }}
          className="bg-[#567134] hover:bg-[#455b2a] text-white shadow-sm"
        >
          <Plus className="h-4 w-4" />
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
          data={[...filteredData].sort((a, b) => {
            const kamarA = dataKamar.find(k => k.id === a.kamarId);
            const kamarB = dataKamar.find(k => k.id === b.kamarId);
            const numA = kamarA ? kamarA.nomorKamar : "";
            const numB = kamarB ? kamarB.nomorKamar : "";
            return numA.localeCompare(numB, undefined, { numeric: true, sensitivity: 'base' });
          })} 
          dataPenghuni={dataPenghuni}
          dataKamar={dataKamar}
          onEdit={handleEdit} 
          onDelete={deletePembayaran} 
        />
      )}

      {hasMountedForm && (
        <PembayaranForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          initialData={editingData}
          dataPenghuni={dataPenghuni}
          dataKamar={dataKamar}
        />
      )}
    </div>
  );
}
