import prisma from '../prisma';

export const getPenghuni = async () => {
  return await prisma.penghuni.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

export const createPenghuni = async (data: any) => {
  const kamar = await prisma.kamar.findUnique({ where: { id: data.kamarId } });
  const harga = kamar ? kamar.hargaPerBulan : 0;

  const newPenghuni = await prisma.penghuni.create({
    data: {
      nama: data.nama,
      nik: data.nik,
      noTelepon: data.noTelepon,
      email: data.email,
      kamarId: data.kamarId,
      tanggalMasuk: data.tanggalMasuk,
      tanggalKeluar: data.tanggalKeluar,
    },
  });

  await prisma.kamar.update({
    where: { id: data.kamarId },
    data: { status: 'terisi' },
  });

  const currentYear = new Date().getFullYear();
  const currentMonthIndex = new Date().getMonth();
  const bulanArray = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const currentMonthName = bulanArray[currentMonthIndex];

  await prisma.pembayaran.create({
    data: {
      penghuniId: newPenghuni.id,
      kamarId: newPenghuni.kamarId,
      bulan: currentMonthName,
      tahun: currentYear,
      jumlah: harga,
      status: 'belum_bayar'
    }
  });

  return newPenghuni;
};

export const updatePenghuni = async (id: string, data: any) => {
  return await prisma.penghuni.update({
    where: { id },
    data: {
      nama: data.nama,
      nik: data.nik,
      noTelepon: data.noTelepon,
      email: data.email,
      kamarId: data.kamarId,
      tanggalMasuk: data.tanggalMasuk,
      tanggalKeluar: data.tanggalKeluar,
    },
  });
};

export const deletePenghuni = async (id: string) => {
  const penghuni = await prisma.penghuni.findUnique({ where: { id } });
  if (penghuni) {
    await prisma.kamar.update({
      where: { id: penghuni.kamarId },
      data: { status: 'tersedia' },
    });
    await prisma.pembayaran.deleteMany({ where: { penghuniId: id } });
    return await prisma.penghuni.delete({ where: { id } });
  }
  throw new Error("Not found");
};
