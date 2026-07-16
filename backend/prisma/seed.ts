import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Resetting existing data...");
  await prisma.pembayaran.deleteMany({});
  await prisma.penghuni.deleteMany({});
  await prisma.kamar.deleteMany({});
  await prisma.admin.deleteMany({});

  console.log("Seeding Admin...");
  await prisma.admin.create({
    data: {
      nama: 'Firman ajah',
      email: 'firmanajah366@gmail.com',
      password: 'Iman12345'
    }
  });

  const fasilitasVIP = ["AC", "WiFi", "Kamar Mandi Dalam", "Kasur Springbed", "Lemari", "Meja Belajar"];
  const fasilitasStandard = ["Kipas Angin", "WiFi", "Kamar Mandi Luar", "Kasur Busa", "Lemari"];

  console.log("Seeding Kamar...");
  const roomsA: any[] = [];
  const roomsB: any[] = [];

  // Seed Kamar A1 - A20
  for (let i = 1; i <= 20; i++) {
    const nomorKamar = `A${i}`;
    const lantai = i <= 10 ? 1 : 2; // 1-10 lantai bawah, 11-20 atas
    const status = i <= 5 ? 'tersedia' : 'terisi'; // 5 tersedia (A1-A5), sisanya terisi
    
    const kamar = await prisma.kamar.create({
      data: {
        nomorKamar,
        lantai,
        tipe: 'VIP',
        hargaPerBulan: 1500000,
        fasilitas: fasilitasVIP,
        status
      }
    });
    roomsA.push(kamar);
  }

  // Seed Kamar B1 - B20
  for (let i = 1; i <= 20; i++) {
    const nomorKamar = `B${i}`;
    const lantai = i <= 10 ? 1 : 2; // 1-10 lantai bawah, 11-20 atas
    const status = i <= 5 ? 'tersedia' : 'terisi'; // 5 tersedia (B1-B5), sisanya terisi
    
    const kamar = await prisma.kamar.create({
      data: {
        nomorKamar,
        lantai,
        tipe: 'Standard',
        hargaPerBulan: 800000,
        fasilitas: fasilitasStandard,
        status
      }
    });
    roomsB.push(kamar);
  }

  console.log("Seeding Penghuni & Pembayaran...");
  const firstNames = [
    "Budi", "Siti", "Andi", "Rina", "Agus", "Dewi", "Joko", "Sri", 
    "Eko", "Yuni", "Hadi", "Mega", "Roni", "Ayu", "Dodi", "Indah", 
    "Toni", "Lina", "Hendra", "Sari", "Rudi", "Tina", "Edi", "Gita", 
    "Dedi", "Maya", "Wawan", "Novi", "Surya", "Lilis"
  ];

  const lastNames = [
    "Santoso", "Aminah", "Wijaya", "Melati", "Prasetyo", "Lestari", "Hidayat", "Wahyuni", 
    "Saputra", "Utami", "Kusuma", "Fitri", "Gunawan", "Pertiwi", "Setiawan", "Rahayu", 
    "Nugroho", "Kartika", "Budiman", "Wulandari"
  ];

  // Ambil kamar yang terisi saja untuk dihuni (A6-A20 & B6-B20)
  const occupiedRooms = [
    ...roomsA.filter(r => r.status === 'terisi'),
    ...roomsB.filter(r => r.status === 'terisi')
  ];

  const bulanArray = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  
  // Tanggal Masuk Generator untuk 30 penghuni
  // 4 Penghuni pertama (index 0, 1, 2, 3) diatur masuk di tahun 2024
  function getTanggalMasuk(index: number): string {
    const dates2024 = ["2024-01-10", "2024-04-15", "2024-07-05", "2024-10-12"];
    if (index < 4) {
      return dates2024[index];
    }
    // 2025 dates (index 4 s/d 19 -> 16 penghuni)
    if (index < 20) {
      const month = ((index - 4) % 12) + 1; // 1 s/d 12
      const mStr = month < 10 ? `0${month}` : `${month}`;
      const day = 5 + (index * 3) % 20;
      const dStr = day < 10 ? `0${day}` : `${day}`;
      return `2025-${mStr}-${dStr}`;
    }
    // 2026 dates (index 20 s/d 29 -> 10 penghuni)
    const month = ((index - 20) % 7) + 1; // Jan s/d Jul
    const mStr = month < 10 ? `0${month}` : `${month}`;
    const day = 1 + (index * 5) % 25;
    const dStr = day < 10 ? `0${day}` : `${day}`;
    return `2026-${mStr}-${dStr}`;
  }

  for (let idx = 0; idx < occupiedRooms.length; idx++) {
    const room = occupiedRooms[idx];
    const nama = `${firstNames[idx % firstNames.length]} ${lastNames[idx % lastNames.length]}`;
    const nik = `320101${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const noTelepon = `0812${Math.floor(10000000 + Math.random() * 90000000)}`;
    const tanggalMasuk = getTanggalMasuk(idx);

    // Create Penghuni
    const newPenghuni = await prisma.penghuni.create({
      data: {
        nama,
        nik,
        noTelepon,
        kamarId: room.id,
        tanggalMasuk
      }
    });

    // Create riwayat pembayaran dari tanggalMasuk s/d Juli 2026
    const start = new Date(tanggalMasuk);
    const end = new Date("2026-07-16T00:00:00Z"); // Sesuai waktu saat ini (Juli 2026)

    const startYear = start.getFullYear();
    const startMonth = start.getMonth();
    const targetYear = end.getFullYear();
    const targetMonth = end.getMonth();

    for (let y = startYear; y <= targetYear; y++) {
      const startM = (y === startYear) ? startMonth : 0;
      const endM = (y === targetYear) ? targetMonth : 11;

      for (let m = startM; m <= endM; m++) {
        const bulanName = bulanArray[m];
        
        let status: 'lunas' | 'belum_bayar' | 'terlambat' = 'lunas';
        let tanggalBayar: string | null = null;

        // Tentukan status untuk bulan berjalan (Juli 2026)
        if (y === targetYear && m === targetMonth) {
          if (idx % 3 === 0) {
            status = 'belum_bayar'; // 10 tenants (e.g. idx 0, 3, 6, 9, 12, 15, 18, 21, 24, 27)
          } else if (idx % 4 === 1) {
            status = 'terlambat';    // 6 tenants (e.g. idx 1, 5, 13, 17, 25, 29)
          } else if (idx % 5 === 2) {
            status = 'belum_bayar'; // 3 additional tenants (idx 2, 7, 22)
          } else {
            status = 'lunas';
          }
        } else {
          // Bulan-bulan sebelumnya selalu lunas
          status = 'lunas';
        }

        if (status === 'lunas') {
          const payDay = 1 + (idx + m) % 10;
          const pdStr = payDay < 10 ? `0${payDay}` : `${payDay}`;
          const mStr = (m + 1) < 10 ? `0${m + 1}` : `${m + 1}`;
          tanggalBayar = `${y}-${mStr}-${pdStr}`;
        }

        await prisma.pembayaran.create({
          data: {
            penghuniId: newPenghuni.id,
            kamarId: room.id,
            bulan: bulanName,
            tahun: y,
            jumlah: room.hargaPerBulan,
            tanggalBayar,
            status
          }
        });
      }
    }
  }

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
