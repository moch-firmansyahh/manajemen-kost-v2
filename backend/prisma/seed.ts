import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Resetting existing data...");
  await prisma.pembayaran.deleteMany({});
  await prisma.penghuni.deleteMany({});
  await prisma.kamar.deleteMany({});

  const fasilitasA = ["AC", "WiFi", "Kamar Mandi Dalam", "Kasur Springbed", "Lemari", "Meja Belajar"];
  const fasilitasB = ["Kipas Angin", "WiFi", "Kamar Mandi Luar", "Kasur Busa", "Lemari"];

  console.log("Seeding Kamar...");
  const kamarA1 = await prisma.kamar.create({
    data: { nomorKamar: 'A1', lantai: 1, tipe: 'VIP', hargaPerBulan: 1500000, fasilitas: fasilitasA, status: 'terisi' }
  });
  const kamarA2 = await prisma.kamar.create({
    data: { nomorKamar: 'A2', lantai: 1, tipe: 'VIP', hargaPerBulan: 1500000, fasilitas: fasilitasA, status: 'tersedia' }
  });
  const kamarA3 = await prisma.kamar.create({
    data: { nomorKamar: 'A3', lantai: 1, tipe: 'VIP', hargaPerBulan: 1500000, fasilitas: fasilitasA, status: 'terisi' }
  });
  const kamarA4 = await prisma.kamar.create({
    data: { nomorKamar: 'A4', lantai: 1, tipe: 'VIP', hargaPerBulan: 1500000, fasilitas: fasilitasA, status: 'tersedia' }
  });
  const kamarA5 = await prisma.kamar.create({
    data: { nomorKamar: 'A5', lantai: 1, tipe: 'VIP', hargaPerBulan: 1500000, fasilitas: fasilitasA, status: 'maintenance' }
  });

  const kamarB1 = await prisma.kamar.create({
    data: { nomorKamar: 'B1', lantai: 2, tipe: 'Standard', hargaPerBulan: 800000, fasilitas: fasilitasB, status: 'terisi' }
  });
  const kamarB2 = await prisma.kamar.create({
    data: { nomorKamar: 'B2', lantai: 2, tipe: 'Standard', hargaPerBulan: 800000, fasilitas: fasilitasB, status: 'tersedia' }
  });
  const kamarB3 = await prisma.kamar.create({
    data: { nomorKamar: 'B3', lantai: 2, tipe: 'Standard', hargaPerBulan: 800000, fasilitas: fasilitasB, status: 'terisi' }
  });
  const kamarB4 = await prisma.kamar.create({
    data: { nomorKamar: 'B4', lantai: 2, tipe: 'Standard', hargaPerBulan: 800000, fasilitas: fasilitasB, status: 'tersedia' }
  });
  const kamarB5 = await prisma.kamar.create({
    data: { nomorKamar: 'B5', lantai: 2, tipe: 'Standard', hargaPerBulan: 800000, fasilitas: fasilitasB, status: 'maintenance' }
  });

  console.log("Seeding Penghuni...");
  const penghuni1 = await prisma.penghuni.create({
    data: {
      nama: 'Budi Santoso',
      nik: '3201010101010001',
      noTelepon: '081234567890',
      email: 'budi@example.com',
      kamarId: kamarA1.id,
      tanggalMasuk: '2023-01-15',
    }
  });

  const penghuni2 = await prisma.penghuni.create({
    data: {
      nama: 'Siti Aminah',
      nik: '3201010101010002',
      noTelepon: '081298765432',
      email: 'siti@example.com',
      kamarId: kamarA3.id,
      tanggalMasuk: '2023-03-10',
    }
  });

  const penghuni3 = await prisma.penghuni.create({
    data: {
      nama: 'Andi Wijaya',
      nik: '3201010101010003',
      noTelepon: '085612345678',
      email: 'andi@example.com',
      kamarId: kamarB1.id,
      tanggalMasuk: '2023-06-01',
    }
  });

  const penghuni4 = await prisma.penghuni.create({
    data: {
      nama: 'Dewi Lestari (Alumni)',
      nik: '3201010101010004',
      noTelepon: '087712345678',
      email: 'dewi@example.com',
      kamarId: kamarA2.id, // Previously occupied A2
      tanggalMasuk: '2022-01-01',
      tanggalKeluar: '2023-01-01',
    }
  });

  const penghuni5 = await prisma.penghuni.create({
    data: {
      nama: 'Rina Melati',
      nik: '3201010101010005',
      noTelepon: '089912345678',
      email: 'rina@example.com',
      kamarId: kamarB3.id,
      tanggalMasuk: new Date().toISOString(), // Recent tenant
    }
  });

  const currentYear = new Date().getFullYear();
  const currentMonthIndex = new Date().getMonth();
  const bulanArray = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const currentMonthName = bulanArray[currentMonthIndex];

  console.log("Seeding Pembayaran...");
  // Lunas
  await prisma.pembayaran.create({
    data: {
      penghuniId: penghuni1.id,
      kamarId: kamarA1.id,
      bulan: currentMonthName,
      tahun: currentYear,
      jumlah: 1500000,
      tanggalBayar: new Date().toISOString(),
      status: 'lunas'
    }
  });
  
  // Belum Bayar
  await prisma.pembayaran.create({
    data: {
      penghuniId: penghuni2.id,
      kamarId: kamarA3.id,
      bulan: currentMonthName,
      tahun: currentYear,
      jumlah: 1500000,
      status: 'belum_bayar'
    }
  });

  // Terlambat
  await prisma.pembayaran.create({
    data: {
      penghuniId: penghuni3.id,
      kamarId: kamarB1.id,
      bulan: bulanArray[(currentMonthIndex + 11) % 12], // Previous month
      tahun: currentMonthIndex === 0 ? currentYear - 1 : currentYear,
      jumlah: 800000,
      status: 'terlambat'
    }
  });
  
  await prisma.pembayaran.create({
    data: {
      penghuniId: penghuni3.id,
      kamarId: kamarB1.id,
      bulan: currentMonthName,
      tahun: currentYear,
      jumlah: 800000,
      status: 'belum_bayar'
    }
  });

  // Lunas new tenant
  await prisma.pembayaran.create({
    data: {
      penghuniId: penghuni5.id,
      kamarId: kamarB3.id,
      bulan: currentMonthName,
      tahun: currentYear,
      jumlah: 800000,
      tanggalBayar: new Date().toISOString(),
      status: 'lunas'
    }
  });

  console.log("Seeding completed successfully! 🎉");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
