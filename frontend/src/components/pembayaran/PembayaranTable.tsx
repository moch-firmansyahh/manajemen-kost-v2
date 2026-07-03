"use client";

import { Pembayaran, Penghuni, Kamar } from "@/types";
import { formatRupiah } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "./StatusBadge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import { TransitionLink as Link } from "@/components/ui/TransitionLink";

interface PembayaranTableProps {
  data: Pembayaran[];
  dataPenghuni: Penghuni[];
  dataKamar: Kamar[];
  onEdit: (pembayaran: Pembayaran) => void;
  onDelete: (id: string) => void;
}

export const PembayaranTable = ({ data, dataPenghuni, dataKamar, onEdit, onDelete }: PembayaranTableProps) => {
  if (data.length === 0) {
    return <div className="text-center py-10 text-muted-foreground bg-card rounded-xl border border-border shadow-sm">Belum ada data pembayaran</div>;
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      <Table className="min-w-[950px]">
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Penghuni</TableHead>
            <TableHead>Kamar</TableHead>
            <TableHead>Bulan/Tahun</TableHead>
            <TableHead>Jatuh Tempo</TableHead>
            <TableHead>Tgl Dibayar</TableHead>
            <TableHead>Jumlah</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((bayar) => {
            const penghuni = dataPenghuni.find(p => p.id === bayar.penghuniId);
            const kamar = dataKamar.find(k => k.id === bayar.kamarId);
            const namaBulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
            
            // Hitung Jatuh Tempo
            let dueText = "-";
            if (penghuni) {
              const masukDate = new Date(penghuni.tanggalMasuk);
              const dueDay = masukDate.getDate();
              const monthIndex = namaBulan.indexOf(bayar.bulan);
              if (monthIndex !== -1) {
                dueText = `${dueDay} ${bayar.bulan} ${bayar.tahun}`;
              }
            }

            // Teks Tanggal Dibayar
            let payText = "-";
            if (bayar.status === "lunas" && bayar.tanggalBayar) {
              const payDate = new Date(bayar.tanggalBayar);
              payText = `${payDate.getDate()} ${namaBulan[payDate.getMonth()]} ${payDate.getFullYear()}`;
            }
            
            return (
              <TableRow key={bayar.id} className="hover:bg-muted/50 transition-colors">
                <TableCell className="font-semibold text-foreground">{penghuni ? penghuni.nama : "-"}</TableCell>
                <TableCell className="text-foreground">{kamar ? kamar.nomorKamar : "-"}</TableCell>
                <TableCell className="text-foreground">{bayar.bulan} {bayar.tahun}</TableCell>
                <TableCell className="text-muted-foreground">{dueText}</TableCell>
                <TableCell className="text-foreground">
                  {bayar.status === "lunas" ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">{payText}</span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="text-foreground">{formatRupiah(bayar.jumlah)}</TableCell>
                <TableCell>
                  <StatusBadge status={bayar.status} />
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" asChild className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/50">
                    <Link href={`/pembayaran/${bayar.id}`} prefetch={true}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onEdit(bayar)} className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-900/50">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(bayar.id)} className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/50">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
