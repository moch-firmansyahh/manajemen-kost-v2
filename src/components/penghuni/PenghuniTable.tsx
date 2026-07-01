"use client";

import { Penghuni, Kamar } from "@/types";
import { formatDate } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, LogOut } from "lucide-react";
import Link from "next/link";

interface PenghuniTableProps {
  data: Penghuni[];
  dataKamar: Kamar[];
  onEdit: (penghuni: Penghuni) => void;
  onDelete: (id: string) => void;
  onCheckout?: (id: string) => void;
}

export const PenghuniTable = ({ data, dataKamar, onEdit, onDelete, onCheckout }: PenghuniTableProps) => {
  if (data.length === 0) {
    return <div className="text-center py-10 text-muted-foreground bg-card rounded-xl border border-border shadow-sm">Belum ada data penghuni</div>;
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      <Table className="min-w-[600px]">
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Kamar</TableHead>
            <TableHead>Tgl Masuk</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((penghuni) => {
            const kamar = dataKamar.find(k => k.id === penghuni.kamarId);
            const isAktif = !penghuni.tanggalKeluar;
            
            return (
              <TableRow key={penghuni.id} className="hover:bg-muted/50 transition-colors">
                <TableCell className="font-semibold text-foreground">{penghuni.nama}</TableCell>
                <TableCell className="text-foreground">{kamar ? kamar.nomorKamar : "-"}</TableCell>
                <TableCell className="text-foreground">{formatDate(penghuni.tanggalMasuk)}</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={isAktif 
                      ? "bg-emerald-100/80 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30" 
                      : "bg-muted text-muted-foreground border-border"
                    }
                  >
                    {isAktif ? "Aktif" : "Sudah Keluar"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  {isAktif && onCheckout && (
                    <Button variant="ghost" size="icon" onClick={() => onCheckout(penghuni.id)} className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/50" title="Checkout Penghuni">
                      <LogOut className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" asChild className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/50">
                    <Link href={`/penghuni/${penghuni.id}`} prefetch={true}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onEdit(penghuni)} className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-900/50">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(penghuni.id)} className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/50" title="Hapus Permanen">
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
