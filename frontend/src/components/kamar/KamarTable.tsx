"use client";

import { Kamar } from "@/types";
import { formatRupiah } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { KamarBadge } from "./KamarBadge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

interface KamarTableProps {
  data: Kamar[];
  onEdit: (kamar: Kamar) => void;
  onDelete: (id: string) => void;
}

export const KamarTable = ({ data, onEdit, onDelete }: KamarTableProps) => {
  if (data.length === 0) {
    return <div className="text-center py-10 text-muted-foreground bg-card rounded-xl border border-border shadow-sm">Belum ada data kamar</div>;
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      <Table className="min-w-[600px]" containerClassName="max-h-[444px]">
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead className="w-[100px]">No. Kamar</TableHead>
            <TableHead>Tipe</TableHead>
            <TableHead>Harga/Bulan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((kamar) => (
            <TableRow key={kamar.id} className="hover:bg-muted/50 transition-colors">
              <TableCell className="font-semibold text-foreground">{kamar.nomorKamar}</TableCell>
              <TableCell className="text-foreground">{kamar.tipe}</TableCell>
              <TableCell className="text-foreground">{formatRupiah(kamar.hargaPerBulan)}</TableCell>
              <TableCell>
                <KamarBadge status={kamar.status} />
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="ghost" size="icon" asChild className="text-primary hover:bg-primary/10 dark:hover:bg-primary/20">
                  <Link href={`/kamar/${kamar.id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onEdit(kamar)} className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-900/50">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(kamar.id)} className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/50">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
