"use client";

import { use, useState } from "react";
import { usePenghuni } from "@/hooks/usePenghuni";
import { useKamar } from "@/hooks/useKamar";
import { usePembayaran } from "@/hooks/usePembayaran";
import { formatDate, formatRupiah } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Phone, Mail, CreditCard, CalendarDays, Filter } from "lucide-react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PenghuniDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  
  const { getPenghuniById } = usePenghuni();
  const { getKamarById } = useKamar();
  const { dataPembayaran } = usePembayaran();

  const penghuni = getPenghuniById(id);
  
  const currentYear = new Date().getFullYear().toString();
  const [filterTahun, setFilterTahun] = useState<string>(currentYear);

  if (!penghuni) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-xl font-semibold text-muted-foreground">Penghuni tidak ditemukan</h2>
        <Button variant="link" asChild className="mt-4">
          <Link href="/penghuni">Kembali ke Daftar Penghuni</Link>
        </Button>
      </div>
    );
  }

  const kamar = getKamarById(penghuni.kamarId);
  const allRiwayat = dataPembayaran.filter(p => p.penghuniId === id);
  
  const availableYears = Array.from(
    new Set([currentYear, ...allRiwayat.map(p => p.tahun.toString())])
  ).sort((a, b) => parseInt(b) - parseInt(a));

  const riwayatPembayaran = allRiwayat.filter(p => {
    if (filterTahun !== "semua" && p.tahun.toString() !== filterTahun) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/penghuni"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Detail Penghuni</h1>
          <p className="text-muted-foreground mt-1">Informasi lengkap dan riwayat pembayaran.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-border shadow-sm lg:col-span-1 bg-gradient-to-b from-blue-50/50 to-background dark:from-blue-950/20">
          <CardHeader>
            <div className="flex flex-col items-center">
              <div className="h-24 w-24 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 shadow-sm">
                <User className="h-10 w-10" />
              </div>
              <CardTitle className="text-xl">{penghuni.nama}</CardTitle>
              <Badge variant="outline" className={`mt-2 ${!penghuni.tanggalKeluar ? "bg-emerald-100/80 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30" : "bg-muted text-muted-foreground border-border"}`}>
                {!penghuni.tanggalKeluar ? "Penghuni Aktif" : "Mantan Penghuni"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center text-sm text-foreground">
              <CreditCard className="h-4 w-4 mr-3 text-muted-foreground" />
              <span>NIK: <span className="font-medium">{penghuni.nik}</span></span>
            </div>
            <div className="flex items-center text-sm text-foreground">
              <Phone className="h-4 w-4 mr-3 text-muted-foreground" />
              <span>{penghuni.noTelepon}</span>
            </div>
            <div className="flex items-center text-sm text-foreground">
              <CalendarDays className="h-4 w-4 mr-3 text-muted-foreground" />
              <span>Masuk: <span className="font-medium">{formatDate(penghuni.tanggalMasuk)}</span></span>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle>Informasi Kamar</CardTitle>
            </CardHeader>
            <CardContent>
              {kamar ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Nomor Kamar</p>
                    <p className="font-medium text-lg text-foreground">{kamar.nomorKamar}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tipe</p>
                    <p className="font-medium text-foreground">{kamar.tipe}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Harga per Bulan</p>
                    <p className="font-medium text-foreground">{formatRupiah(kamar.hargaPerBulan)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Lantai</p>
                    <p className="font-medium text-foreground">{kamar.lantai}</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Kamar tidak ditemukan atau telah dihapus.</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Riwayat Pembayaran</CardTitle>
              <div className="flex items-center gap-2 max-w-[150px]">
                <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />
                <Select 
                  value={filterTahun} 
                  onValueChange={setFilterTahun}
                >
                  <SelectTrigger className="bg-background border-border h-8 text-xs">
                    <SelectValue placeholder="Tahun" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="semua">Semua</SelectItem>
                    {availableYears.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {riwayatPembayaran.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bulan/Tahun</TableHead>
                      <TableHead>Jumlah</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tgl Bayar</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {riwayatPembayaran.map((bayar) => (
                      <TableRow key={bayar.id}>
                        <TableCell className="text-foreground">{bayar.bulan} {bayar.tahun}</TableCell>
                        <TableCell className="text-foreground">{formatRupiah(bayar.jumlah)}</TableCell>
                        <TableCell>
                          <Badge variant={bayar.status === "lunas" ? "default" : "destructive"}>
                            {bayar.status.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-foreground">
                          {bayar.tanggalBayar ? formatDate(bayar.tanggalBayar) : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6 text-muted-foreground">Belum ada riwayat pembayaran di tahun ini</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
