"use client";

import { useState } from "react";
import { usePenghuni } from "@/hooks/usePenghuni";
import { useKamar } from "@/hooks/useKamar";
import { autoGenerateTagihan, usePembayaran } from "@/hooks/usePembayaran";
import { PenghuniTable } from "@/components/penghuni/PenghuniTable";
import dynamic from "next/dynamic";
const PenghuniForm = dynamic(() => import("@/components/penghuni/PenghuniForm").then(mod => mod.PenghuniForm), { ssr: false });
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { Penghuni } from "@/types";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function PenghuniPage() {
  const { dataPenghuni, isLoading, addPenghuni, updatePenghuni, deletePenghuni } = usePenghuni();
  const { dataKamar } = useKamar();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [hasMountedForm, setHasMountedForm] = useState(false);
  const [editingData, setEditingData] = useState<Penghuni | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"aktif" | "alumni">("aktif");

  const filteredData = dataPenghuni.filter(p => {
    const matchName = p.nama.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = activeTab === "aktif" ? !p.tanggalKeluar : !!p.tanggalKeluar;
    return matchName && matchStatus;
  });

  const handleEdit = (penghuni: Penghuni) => {
    setEditingData(penghuni);
    setHasMountedForm(true);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingData(null);
  };

  const handleCheckout = (id: string) => {
    const penghuni = dataPenghuni.find(p => p.id === id);
    if (penghuni && !penghuni.tanggalKeluar) {
      updatePenghuni(id, { tanggalKeluar: new Date().toISOString() });
    }
  };

  const handleSubmit = (data: Omit<Penghuni, "id" | "createdAt">) => {
    if (editingData) {
      updatePenghuni(editingData.id, data);
    } else {
      addPenghuni(data);
      // Trigger update tagihan agar tagihan penghuni baru langsung muncul
      setTimeout(() => {
        autoGenerateTagihan();
      }, 0);
    }
  };

  const handleDelete = (id: string) => {
    deletePenghuni(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Penghuni</h1>
        </div>
        <Button 
          onClick={() => {
            setHasMountedForm(true);
            setIsFormOpen(true);
          }}
          className="bg-[#567134] hover:bg-[#455b2a] text-white shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Tambah Penghuni
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Tabs Filter */}
        <div className="flex bg-muted p-1 rounded-lg">
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

        {/* Search */}
        <div className="flex items-center w-full sm:max-w-sm relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Cari nama penghuni..." 
            className="pl-10 bg-background border-border focus-visible:ring-primary w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
        <PenghuniTable 
          data={[...filteredData].sort((a, b) => {
            const kamarA = dataKamar.find(k => k.id === a.kamarId);
            const kamarB = dataKamar.find(k => k.id === b.kamarId);
            const numA = kamarA ? kamarA.nomorKamar : "";
            const numB = kamarB ? kamarB.nomorKamar : "";
            return numA.localeCompare(numB, undefined, { numeric: true, sensitivity: 'base' });
          })} 
          dataKamar={dataKamar}
          onEdit={handleEdit} 
          onDelete={handleDelete} 
          onCheckout={handleCheckout}
        />
      )}

      {hasMountedForm && (
        <PenghuniForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          initialData={editingData}
          dataKamar={dataKamar}
        />
      )}
    </div>
  );
}
