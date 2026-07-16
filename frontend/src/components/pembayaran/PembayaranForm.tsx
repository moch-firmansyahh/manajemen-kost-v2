"use client";

import { useState, useEffect } from "react";
import { Pembayaran, Penghuni, StatusPembayaran, Kamar } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface PembayaranFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Pembayaran, "id" | "createdAt">) => void;
  initialData?: Pembayaran | null;
  dataPenghuni: Penghuni[];
  dataKamar: Kamar[];
}

const BULAN_OPTIONS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const DEFAULT_STATE = {
  penghuniId: "",
  kamarId: "",
  bulan: BULAN_OPTIONS[new Date().getMonth()],
  tahun: new Date().getFullYear(),
  jumlah: 0,
  tanggalBayar: null as string | null,
  status: "belum_bayar" as StatusPembayaran,
};

export const PembayaranForm = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  dataPenghuni,
  dataKamar,
}: PembayaranFormProps) => {
  const [formData, setFormData] = useState(DEFAULT_STATE);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        penghuniId: initialData.penghuniId,
        kamarId: initialData.kamarId,
        bulan: initialData.bulan,
        tahun: initialData.tahun,
        jumlah: initialData.jumlah / 1000,
        tanggalBayar: initialData.tanggalBayar
          ? initialData.tanggalBayar.split("T")[0]
          : null,
        status: initialData.status,
      });
    } else {
      setFormData(DEFAULT_STATE);
    }
    setError(null);
  }, [initialData, isOpen]);

  const handlePenghuniChange = (penghuniId: string) => {
    const penghuni = dataPenghuni.find((p) => p.id === penghuniId);
    if (penghuni) {
      const kamar = dataKamar.find((k) => k.id === penghuni.kamarId);
      setFormData({
        ...formData,
        penghuniId,
        kamarId: penghuni.kamarId,
        jumlah: kamar ? kamar.hargaPerBulan / 1000 : 0,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.penghuniId) {
      setError("Silakan pilih penghuni terlebih dahulu");
      return;
    }

    if (formData.status === "lunas" && !formData.tanggalBayar) {
      setError("Silakan isi Tanggal Bayar jika statusnya Lunas");
      return;
    }

    onSubmit({
      ...formData,
      jumlah: formData.jumlah * 1000,
      tanggalBayar:
        formData.tanggalBayar && formData.status === "lunas"
          ? new Date(formData.tanggalBayar).toISOString()
          : null,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Pembayaran" : "Tambah Pembayaran"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="penghuniId">Penghuni</Label>
            <Select
              value={formData.penghuniId}
              onValueChange={handlePenghuniChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Penghuni" />
              </SelectTrigger>
              <SelectContent>
                {dataPenghuni.map((penghuni) => (
                  <SelectItem key={penghuni.id} value={penghuni.id}>
                    {penghuni.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bulan">Bulan</Label>
              <Select
                value={formData.bulan}
                onValueChange={(value) =>
                  setFormData({ ...formData, bulan: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Bulan" />
                </SelectTrigger>
                <SelectContent>
                  {BULAN_OPTIONS.map((bulan) => (
                    <SelectItem key={bulan} value={bulan}>
                      {bulan}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tahun">Tahun</Label>
              <Input
                id="tahun"
                type="number"
                min="2020"
                required
                value={formData.tahun}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tahun: parseInt(e.target.value) || new Date().getFullYear(),
                  })
                }
                onFocus={(e) => e.target.select()}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jumlah">Jumlah Tagihan (Ribuan)</Label>
            <div className="relative">
              <Input
                id="jumlah"
                type="number"
                min="0"
                required
                value={formData.jumlah}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    jumlah: parseInt(e.target.value) || 0,
                  })
                }
                onFocus={(e) => e.target.select()}
                className="pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                .000
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({ ...formData, status: value as StatusPembayaran })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lunas">Lunas</SelectItem>
                <SelectItem value="belum_bayar">Belum Bayar</SelectItem>
                <SelectItem value="terlambat">Terlambat</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.status === "lunas" && (
            <div className="space-y-2 flex flex-col">
              <Label htmlFor="tanggalBayar">Tanggal Bayar</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.tanggalBayar && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.tanggalBayar ? (
                      format(new Date(formData.tanggalBayar), "dd/MM/yyyy")
                    ) : (
                      <span>Pilih tanggal bayar</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={
                      formData.tanggalBayar
                        ? new Date(formData.tanggalBayar)
                        : undefined
                    }
                    onSelect={(date) =>
                      setFormData({
                        ...formData,
                        tanggalBayar: date ? date.toISOString() : null,
                      })
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          {error && (
            <div className="text-sm font-medium text-red-500 text-right mt-2">
              *{error}
            </div>
          )}

          <div className="pt-4 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Simpan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
