"use client";

import { useState } from "react";
import { useKamar } from "@/hooks/useKamar";
import { usePenghuni } from "@/hooks/usePenghuni";
import { usePembayaran } from "@/hooks/usePembayaran";
import { StatCard } from "@/components/dashboard/StatCard";
import { FileDown } from "lucide-react";
import { formatRupiah, formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { exportKamarPenghuniToPDF } from "@/lib/pdfExport";

export default function Dashboard() {
  const { dataKamar, isLoading: isKamarLoading } = useKamar();
  const { dataPenghuni, isLoading: isPenghuniLoading } = usePenghuni();
  const { dataPembayaran, isLoading: isPembayaranLoading } = usePembayaran();
  
  const isLoading = isKamarLoading || isPenghuniLoading || isPembayaranLoading;

  const [selectedBulan, setSelectedBulan] = useState<string>("semua");
  const [selectedTahun, setSelectedTahun] = useState<number>(new Date().getFullYear());
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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

  const unpaidPembayaran = dataPembayaran
    .filter(p => p.status === "terlambat")
    .sort((a, b) => {
      const nameA = dataPenghuni.find(pen => pen.id === a.penghuniId)?.nama || "";
      const nameB = dataPenghuni.find(pen => pen.id === b.penghuniId)?.nama || "";
      return nameA.localeCompare(nameB, 'id');
    })
    .slice(0, 4);

  const penghuniTerbaru = dataPenghuni
    .filter(p => {
      const tglMasuk = new Date(p.tanggalMasuk);
      return tglMasuk.getMonth() === currentMonthIndex && tglMasuk.getFullYear() === currentYear;
    })
    .sort((a, b) => a.nama.localeCompare(b.nama, 'id'))
    .slice(0, 4);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Dashboard</h1>
        </div>
        {!isLoading && (
          <Button
            variant="outline"
            onClick={() => setIsModalOpen(true)}
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
                  <div className="max-h-[300px] overflow-y-auto pr-1">
                    <Table className="min-w-[400px]">
                      <TableHeader className="sticky top-0 bg-card z-10">
                        <TableRow>
                          <TableHead className="bg-card">Nama</TableHead>
                          <TableHead className="bg-card">Kamar</TableHead>
                          <TableHead className="bg-card">Tgl Masuk</TableHead>
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
                  </div>
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
                  <div className="max-h-[300px] overflow-y-auto pr-1">
                    <Table className="min-w-[400px]">
                      <TableHeader className="sticky top-0 bg-card z-10">
                        <TableRow>
                          <TableHead className="bg-card">Penghuni</TableHead>
                          <TableHead className="bg-card">Kamar</TableHead>
                          <TableHead className="bg-card">Bulan</TableHead>
                          <TableHead className="bg-card">Jumlah</TableHead>
                          <TableHead className="bg-card">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {unpaidPembayaran.map((bayar) => {
                          const penghuni = dataPenghuni.find(p => p.id === bayar.penghuniId);
                          const kamar = dataKamar.find(k => k.id === bayar.kamarId);
                          return (
                            <TableRow key={bayar.id}>
                              <TableCell className="font-medium text-foreground">{penghuni ? penghuni.nama : "-"}</TableCell>
                              <TableCell className="text-muted-foreground">{kamar ? kamar.nomorKamar : "-"}</TableCell>
                              <TableCell className="text-muted-foreground">{bayar.bulan}</TableCell>
                              <TableCell className="text-muted-foreground">{formatRupiah(bayar.jumlah)}</TableCell>
                              <TableCell>
                                <Badge 
                                  variant="destructive" 
                                  className={
                                    bayar.status === "terlambat"
                                      ? "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 border-rose-200 dark:border-rose-500/30"
                                      : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border-amber-200 dark:border-amber-500/30"
                                  }
                                >
                                  {bayar.status.replace("_", " ")}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">Semua tagihan sudah lunas 🎉</div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Modal Cetak PDF */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-opacity duration-200">
          <div className="bg-background border border-border p-6 rounded-2xl shadow-2xl max-w-sm w-full space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div>
              <h3 className="text-lg font-bold text-foreground">Cetak Laporan PDF</h3>
              <p className="text-sm text-muted-foreground mt-1">Pilih filter periode bulanan laporan yang ingin dicetak.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Bulan</label>
                <Select value={selectedBulan} onValueChange={setSelectedBulan}>
                  <SelectTrigger className="w-full bg-muted/50 border-border h-11">
                    <SelectValue placeholder="Pilih Bulan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="semua">Semua Bulan</SelectItem>
                    {namaBulan.map((b) => (
                      <SelectItem key={b} value={b}>{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tahun</label>
                <Select value={selectedTahun.toString()} onValueChange={(val) => setSelectedTahun(parseInt(val))}>
                  <SelectTrigger className="w-full bg-muted/50 border-border h-11">
                    <SelectValue placeholder="Tahun" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2026">2026</SelectItem>
                    <SelectItem value="2027">2027</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="ghost"
                onClick={() => setIsModalOpen(false)}
                className="hover:bg-muted font-medium"
              >
                Batal
              </Button>
              <Button
                onClick={() => {
                  exportKamarPenghuniToPDF(dataKamar, dataPenghuni, dataPembayaran, selectedBulan, selectedTahun);
                  setIsModalOpen(false);
                }}
                className="bg-[#567134] hover:bg-[#455b2a] text-white font-medium shadow-md shadow-[#567134]/15"
              >
                Cetak Laporan
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
