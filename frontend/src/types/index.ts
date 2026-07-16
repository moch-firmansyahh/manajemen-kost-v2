export type StatusKamar = "tersedia" | "terisi" | "maintenance";

export type StatusPembayaran = "lunas" | "belum_bayar" | "terlambat";

export interface Kamar {
  id: string;
  nomorKamar: string;
  lantai: number;
  tipe: string;
  hargaPerBulan: number;
  fasilitas: string[];
  status: StatusKamar;
  createdAt: string;
}

export interface Penghuni {
  id: string;
  nama: string;
  nik: string;
  noTelepon: string;
  email?: string;
  kamarId: string;
  tanggalMasuk: string;
  tanggalKeluar: string | null;
  createdAt: string;
}

export interface Pembayaran {
  id: string;
  penghuniId: string;
  kamarId: string;
  bulan: string;
  tahun: number;
  jumlah: number;
  tanggalBayar: string | null;
  status: StatusPembayaran;
  createdAt: string;
}
