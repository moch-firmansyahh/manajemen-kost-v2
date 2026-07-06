"use client";

import { useState } from "react";
import { useKamar } from "@/hooks/useKamar";
import { KamarTable } from "@/components/kamar/KamarTable";
import dynamic from "next/dynamic";
const KamarForm = dynamic(() => import("@/components/kamar/KamarForm").then(mod => mod.KamarForm), { ssr: false });
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import { Kamar, StatusKamar } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function KamarPage() {
  const { dataKamar, isLoading, addKamar, updateKamar, deleteKamar } = useKamar();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [hasMountedForm, setHasMountedForm] = useState(false);
  const [editingData, setEditingData] = useState<Kamar | null>(null);
  const [filterStatus, setFilterStatus] = useState<StatusKamar | "semua">("semua");

  const filteredData = filterStatus === "semua" 
    ? dataKamar 
    : dataKamar.filter(k => k.status === filterStatus);

  const handleEdit = (kamar: Kamar) => {
    setEditingData(kamar);
    setHasMountedForm(true);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingData(null);
  };

  const handleSubmit = (data: Omit<Kamar, "id" | "createdAt">) => {
    if (editingData) {
      updateKamar(editingData.id, data);
    } else {
      addKamar(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Kamar</h1>
        </div>
        <Button 
          onClick={() => {
            setHasMountedForm(true);
            setIsFormOpen(true);
          }}
          className="bg-[#567134] hover:bg-[#455b2a] text-white shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Tambah Kamar
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-xs">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select 
          value={filterStatus} 
          onValueChange={(value) => setFilterStatus(value as StatusKamar | "semua")}
        >
          <SelectTrigger className="bg-background border-border">
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

      {isLoading ? (
        <div className="space-y-4 mt-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : (
        <KamarTable 
          data={filteredData} 
          onEdit={handleEdit} 
          onDelete={deleteKamar} 
        />
      )}

      {hasMountedForm && (
        <KamarForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          initialData={editingData}
        />
      )}
    </div>
  );
}
