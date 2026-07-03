import prisma from '../prisma';

export const getKamar = async () => {
  return await prisma.kamar.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

export const createKamar = async (data: any) => {
  return await prisma.kamar.create({
    data: {
      nomorKamar: data.nomorKamar,
      lantai: data.lantai,
      tipe: data.tipe,
      hargaPerBulan: data.hargaPerBulan,
      fasilitas: data.fasilitas,
      status: data.status,
    },
  });
};

export const updateKamar = async (id: string, data: any) => {
  return await prisma.kamar.update({
    where: { id },
    data,
  });
};

export const deleteKamar = async (id: string) => {
  return await prisma.kamar.delete({ where: { id } });
};
