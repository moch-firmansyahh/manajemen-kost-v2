"use client";

import { use } from "react";
import { usePembayaran } from "@/hooks/usePembayaran";
import { usePenghuni } from "@/hooks/usePenghuni";
import { useKamar } from "@/hooks/useKamar";
import { StatusBadge } from "@/components/pembayaran/StatusBadge";
import { formatDate, formatRupiah } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ReceiptText, User, BedDouble } from "lucide-react";
import Link from "next/link";

export default function PembayaranDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  
  const { getPembayaranById } = usePembayaran();
  const { getPenghuniById } = usePenghuni();
  const { getKamarById } = useKamar();

  const pembayaran = getPembayaranById(id);
  
  if (!pembayaran) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-xl font-semibold text-muted-foreground">Pembayaran tidak ditemukan</h2>
        <Button variant="link" asChild className="mt-4">
          <Link href="/pembayaran">Kembali ke Daftar Pembayaran</Link>
        </Button>
      </div>
    );
  }

  const penghuni = getPenghuniById(pembayaran.penghuniId);
  const kamar = getKamarById(pembayaran.kamarId);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/pembayaran"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Detail Pembayaran</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <StatusBadge status={pembayaran.status} className="text-sm px-3 py-1" />
          </div>
          <CardHeader>
            <div className="flex items-center text-blue-600 dark:text-blue-400 mb-2">
              <ReceiptText className="h-5 w-5 mr-2" />
              <CardTitle className="text-lg text-foreground">Ringkasan Tagihan</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4 border-t border-border">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">Periode</span>
              <span className="font-medium text-foreground">{pembayaran.bulan} {pembayaran.tahun}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">Jumlah Tagihan</span>
              <span className="font-semibold text-lg text-foreground">{formatRupiah(pembayaran.jumlah)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">Tanggal Bayar</span>
              <span className="font-medium text-foreground">
                {pembayaran.tanggalBayar ? formatDate(pembayaran.tanggalBayar) : "-"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-muted-foreground">Dibuat Pada</span>
              <span className="font-medium text-foreground">{formatDate(pembayaran.createdAt)}</span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <div className="flex items-center text-foreground">
                <User className="h-5 w-5 mr-2 text-blue-500" />
                <CardTitle className="text-lg">Informasi Penghuni</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {penghuni ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Nama Lengkap</p>
                    <p className="font-medium text-foreground">{penghuni.nama}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Nomor Telepon</p>
                    <p className="font-medium text-foreground">{penghuni.noTelepon}</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">Penghuni tidak ditemukan.</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader>
              <div className="flex items-center text-foreground">
                <BedDouble className="h-5 w-5 mr-2 text-indigo-500" />
                <CardTitle className="text-lg">Informasi Kamar</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {kamar ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Nomor Kamar</p>
                    <p className="font-medium text-foreground">{kamar.nomorKamar}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Tipe</p>
                    <p className="font-medium text-foreground">{kamar.tipe}</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">Kamar tidak ditemukan.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
