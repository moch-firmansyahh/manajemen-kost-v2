"use client";

import { useKamar } from "@/hooks/useKamar";
import { usePenghuni } from "@/hooks/usePenghuni";
import { usePembayaran } from "@/hooks/usePembayaran";
import { StatCard } from "@/components/dashboard/StatCard";
import { BedDouble, Users, Wallet, AlertCircle, FileDown } from "lucide-react";
import { formatRupiah, formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { exportKamarPenghuniToPDF } from "@/lib/pdfExport";

export default function Dashboard() {
  const { dataKamar, isLoading: isKamarLoading } = useKamar();
  const { dataPenghuni, isLoading: isPenghuniLoading } = usePenghuni();
  const { dataPembayaran, isLoading: isPembayaranLoading } = usePembayaran();
  
  const isLoading = isKamarLoading || isPenghuniLoading || isPembayaranLoading;

  const totalKamar = dataKamar.length;
  const kamarTerisi = dataKamar.filter(k => k.status === "terisi").length;
  const kamarKosong = dataKamar.filter(k => k.status === "tersedia").length;
  
  const namaBulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const currentMonthIndex = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const pendapatanBulanIni = dataPembayaran
    .filter(p => {
      if (p.status !== "lunas" || !p.tanggalBayar) return false;
      const tglBayar = new Date(p.tanggalBayar);
      return tglBayar.getMonth() === currentMonthIndex && tglBayar.getFullYear() === currentYear;
    })
    .reduce((acc, curr) => acc + curr.jumlah, 0);

  const unpaidPembayaran = dataPembayaran.filter(p => p.status === "terlambat");

  const now = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(now.getMonth() - 1);

  const penghuniTerbaru = dataPenghuni
    .filter(p => new Date(p.tanggalMasuk) >= oneMonthAgo)
    .sort((a, b) => new Date(b.tanggalMasuk).getTime() - new Date(a.tanggalMasuk).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Dashboard</h1>
        </div>
        {!isLoading && (
          <Button
            variant="outline"
            onClick={() => exportKamarPenghuniToPDF(dataKamar, dataPenghuni)}
            className="border-border text-foreground hover:bg-muted shadow-sm"
          >
            <FileDown className="h-4 w-4 mr-2" />
            Cetak PDF
          </Button>
        )}
      </div>

      {isLoading ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Skeleton className="h-[300px] w-full rounded-xl" />
            <Skeleton className="h-[300px] w-full rounded-xl" />
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Total Kamar" 
              value={totalKamar} 
              colorClass="bg-gradient-to-tr from-blue-500 to-blue-600"
            />
            <StatCard 
              title="Kamar Terisi" 
              value={kamarTerisi} 
              colorClass="bg-gradient-to-tr from-emerald-400 to-emerald-500"
            />
            <StatCard 
              title="Kamar Kosong" 
              value={kamarKosong} 
              colorClass="bg-gradient-to-tr from-amber-400 to-amber-500"
            />
            <StatCard 
              title="Pendapatan Bulan Ini" 
              value={formatRupiah(pendapatanBulanIni)} 
              colorClass="bg-gradient-to-tr from-indigo-500 to-indigo-600"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">Penghuni Terbaru</CardTitle>
              </CardHeader>
              <CardContent>
                {penghuniTerbaru.length > 0 ? (
                  <Table className="min-w-[400px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Kamar</TableHead>
                        <TableHead>Tgl Masuk</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {penghuniTerbaru.map((penghuni) => {
                        const kamar = dataKamar.find(k => k.id === penghuni.kamarId);
                        return (
                          <TableRow key={penghuni.id}>
                            <TableCell className="font-medium text-foreground">{penghuni.nama}</TableCell>
                            <TableCell className="text-muted-foreground">{kamar ? kamar.nomorKamar : "-"}</TableCell>
                            <TableCell className="text-muted-foreground">{formatDate(penghuni.tanggalMasuk)}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">Belum ada data penghuni</div>
                )}
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">Tagihan Belum Lunas</CardTitle>
              </CardHeader>
              <CardContent>
                {unpaidPembayaran.length > 0 ? (
                  <Table className="min-w-[400px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Penghuni</TableHead>
                        <TableHead>Bulan</TableHead>
                        <TableHead>Jumlah</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {unpaidPembayaran.slice(0, 5).map((bayar) => {
                        const penghuni = dataPenghuni.find(p => p.id === bayar.penghuniId);
                        return (
                          <TableRow key={bayar.id}>
                            <TableCell className="font-medium text-foreground">{penghuni ? penghuni.nama : "-"}</TableCell>
                            <TableCell className="text-muted-foreground">{bayar.bulan}</TableCell>
                            <TableCell className="text-muted-foreground">{formatRupiah(bayar.jumlah)}</TableCell>
                            <TableCell>
                              <Badge variant="destructive" className="bg-destructive/10 text-destructive hover:bg-destructive/20 border-none">
                                {bayar.status.replace("_", " ")}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">Semua tagihan sudah lunas 🎉</div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
