"use client";

import { use } from "react";
import { useKamar } from "@/hooks/useKamar";
import { usePenghuni } from "@/hooks/usePenghuni";
import { usePembayaran } from "@/hooks/usePembayaran";
import { KamarBadge } from "@/components/kamar/KamarBadge";
import { formatRupiah, formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function KamarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  
  const { getKamarById } = useKamar();
  const { dataPenghuni } = usePenghuni();
  const { dataPembayaran } = usePembayaran();

  const kamar = getKamarById(id);
  
  if (!kamar) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-xl font-semibold text-muted-foreground">Kamar tidak ditemukan</h2>
        <Button variant="link" asChild className="mt-4">
          <Link href="/kamar">Kembali ke Daftar Kamar</Link>
        </Button>
      </div>
    );
  }

  // Mencari penghuni yang saat ini menempati kamar (belum keluar)
  const activePenghuni = dataPenghuni.find(p => p.kamarId === id && p.tanggalKeluar === null);
  
  // Tampilkan data penghuni hanya jika ada penghuni aktif
  const penghuniKamar = activePenghuni ? [activePenghuni] : [];
  
  // Tampilkan riwayat pembayaran hanya untuk penghuni aktif tersebut
  const riwayatPembayaran = activePenghuni 
    ? dataPembayaran.filter(p => p.kamarId === id && p.penghuniId === activePenghuni.id) 
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/kamar"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Detail Kamar {kamar.nomorKamar}</h1>
          <p className="text-muted-foreground mt-1">Informasi lengkap dan riwayat kamar.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-border shadow-sm lg:col-span-1">
          <CardHeader>
            <CardTitle>Informasi Kamar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <KamarBadge status={kamar.status} className="mt-1" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tipe Kamar</p>
              <p className="font-medium text-foreground">{kamar.tipe}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lantai</p>
              <p className="font-medium text-foreground">{kamar.lantai}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Harga per Bulan</p>
              <p className="font-medium text-foreground">{formatRupiah(kamar.hargaPerBulan)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Fasilitas</p>
              <div className="flex flex-wrap gap-2">
                {kamar.fasilitas.map((fasilitas, idx) => (
                  <Badge key={idx} variant="secondary" className="bg-muted text-foreground">
                    <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-500" />
                    {fasilitas}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle>Penghuni</CardTitle>
            </CardHeader>
            <CardContent>
              {penghuniKamar.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>No. Telepon</TableHead>
                      <TableHead>Tgl Masuk</TableHead>
                      <TableHead>Tgl Keluar</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {penghuniKamar.map((penghuni) => (
                      <TableRow key={penghuni.id}>
                        <TableCell className="font-medium text-foreground">{penghuni.nama}</TableCell>
                        <TableCell className="text-foreground">{penghuni.noTelepon}</TableCell>
                        <TableCell className="text-foreground">{formatDate(penghuni.tanggalMasuk)}</TableCell>
                        <TableCell>
                          {penghuni.tanggalKeluar ? (
                            <span className="text-foreground">{formatDate(penghuni.tanggalKeluar)}</span>
                          ) : (
                            <span className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">Masih Menempati</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6 text-muted-foreground">Belum ada penghuni</div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle>Riwayat Pembayaran</CardTitle>
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
                <div className="text-center py-6 text-muted-foreground">Belum ada riwayat pembayaran</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
