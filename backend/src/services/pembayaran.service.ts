import prisma from '../prisma';

export const getPembayaran = async () => {
  return await prisma.pembayaran.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

export const createPembayaran = async (data: any) => {
  return await prisma.pembayaran.create({ data });
};

export const updatePembayaran = async (id: string, data: any) => {
  return await prisma.pembayaran.update({
    where: { id },
    data,
  });
};

export const deletePembayaran = async (id: string) => {
  return await prisma.pembayaran.delete({ where: { id } });
};

export const generateTagihanBulk = async (data: any[]) => {
  return await prisma.pembayaran.createMany({
    data,
    skipDuplicates: true,
  });
};
