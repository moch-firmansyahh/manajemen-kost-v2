"use client";

import { useState, useEffect } from "react";
import { Penghuni, Kamar } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PenghuniFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Penghuni, "id" | "createdAt">) => void;
  initialData?: Penghuni | null;
  dataKamar: Kamar[];
}

const DEFAULT_STATE = {
  nama: "",
  nik: "",
  noTelepon: "",
  email: "",
  kamarId: "",
  tanggalMasuk: new Date().toISOString().split('T')[0],
  tanggalKeluar: null as string | null,
};

export const PenghuniForm = ({ isOpen, onClose, onSubmit, initialData, dataKamar }: PenghuniFormProps) => {
  const [formData, setFormData] = useState(DEFAULT_STATE);
  const kamarTersedia = dataKamar.filter(k => k.status === "tersedia" || k.id === formData.kamarId);

  useEffect(() => {
    if (initialData) {
      setFormData({
        nama: initialData.nama,
        nik: initialData.nik,
        noTelepon: initialData.noTelepon,
        email: initialData.email || "",
        kamarId: initialData.kamarId,
        tanggalMasuk: initialData.tanggalMasuk.split('T')[0],
        tanggalKeluar: initialData.tanggalKeluar ? initialData.tanggalKeluar.split('T')[0] : null,
      });
    } else {
      setFormData(DEFAULT_STATE);
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      tanggalMasuk: new Date(formData.tanggalMasuk).toISOString(),
      tanggalKeluar: formData.tanggalKeluar ? new Date(formData.tanggalKeluar).toISOString() : null,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Penghuni" : "Tambah Penghuni"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="nama">Nama Lengkap</Label>
            <Input
              id="nama"
              required
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nik">NIK</Label>
              <Input
                id="nik"
                required
                value={formData.nik}
                onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="noTelepon">No. Telepon</Label>
              <Input
                id="noTelepon"
                required
                value={formData.noTelepon}
                onChange={(e) => setFormData({ ...formData, noTelepon: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="kamarId">Kamar</Label>
            <Select 
              value={formData.kamarId} 
              onValueChange={(value) => setFormData({ ...formData, kamarId: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Kamar" />
              </SelectTrigger>
              <SelectContent>
                {kamarTersedia.map((kamar) => (
                  <SelectItem key={kamar.id} value={kamar.id}>
                    Kamar {kamar.nomorKamar} - {kamar.tipe}
                  </SelectItem>
                ))}
                {kamarTersedia.length === 0 && (
                  <SelectItem value="" disabled>Tidak ada kamar tersedia</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tanggalMasuk">Tanggal Masuk</Label>
              <Input
                id="tanggalMasuk"
                type="date"
                required
                value={formData.tanggalMasuk}
                onChange={(e) => setFormData({ ...formData, tanggalMasuk: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tanggalKeluar">Tanggal Keluar (Opsional)</Label>
              <Input
                id="tanggalKeluar"
                type="date"
                value={formData.tanggalKeluar || ""}
                onChange={(e) => setFormData({ ...formData, tanggalKeluar: e.target.value || null })}
              />
            </div>
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
