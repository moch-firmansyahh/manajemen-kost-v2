"use client";

import { useState, useEffect } from "react";
import { Kamar, StatusKamar } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface KamarFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Kamar, "id" | "createdAt">) => void;
  initialData?: Kamar | null;
}

const DEFAULT_STATE = {
  nomorKamar: "",
  lantai: 1,
  tipe: "",
  hargaPerBulan: 0,
  fasilitas: [] as string[],
  status: "tersedia" as StatusKamar,
};

export const KamarForm = ({ isOpen, onClose, onSubmit, initialData }: KamarFormProps) => {
  const [formData, setFormData] = useState(DEFAULT_STATE);
  const [fasilitasInput, setFasilitasInput] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        nomorKamar: initialData.nomorKamar,
        lantai: initialData.lantai,
        tipe: initialData.tipe,
        hargaPerBulan: initialData.hargaPerBulan / 1000,
        fasilitas: initialData.fasilitas,
        status: initialData.status,
      });
      setFasilitasInput(initialData.fasilitas.join(", "));
    } else {
      setFormData(DEFAULT_STATE);
      setFasilitasInput("");
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      hargaPerBulan: formData.hargaPerBulan * 1000,
      fasilitas: fasilitasInput.split(",").map(item => item.trim()).filter(Boolean),
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Kamar" : "Tambah Kamar"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nomorKamar">Nomor Kamar</Label>
              <Input
                id="nomorKamar"
                required
                value={formData.nomorKamar}
                onChange={(e) => setFormData({ ...formData, nomorKamar: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lantai">Lantai</Label>
              <Input
                id="lantai"
                type="number"
                min="1"
                required
                value={formData.lantai}
                onChange={(e) => setFormData({ ...formData, lantai: parseInt(e.target.value) || 1 })}
                onFocus={(e) => e.target.select()}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tipe">Tipe Kamar</Label>
            <Input
              id="tipe"
              required
              value={formData.tipe}
              onChange={(e) => setFormData({ ...formData, tipe: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="harga">Harga per Bulan (Ribuan)</Label>
            <div className="relative">
              <Input
                id="harga"
                type="number"
                min="0"
                required
                value={formData.hargaPerBulan}
                onChange={(e) => setFormData({ ...formData, hargaPerBulan: parseInt(e.target.value) || 0 })}
                onFocus={(e) => e.target.select()}
                className="pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                .000
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fasilitas">Fasilitas (pisahkan dengan koma)</Label>
            <Input
              id="fasilitas"
              placeholder="Contoh: AC, Kasur, Lemari"
              value={fasilitasInput}
              onChange={(e) => setFasilitasInput(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value) => setFormData({ ...formData, status: value as StatusKamar })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tersedia">Tersedia</SelectItem>
                <SelectItem value="terisi">Terisi</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">Simpan</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
