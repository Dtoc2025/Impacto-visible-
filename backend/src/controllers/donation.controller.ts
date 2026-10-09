import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/db.js';

const donationSchema = z.object({
  amount: z.number().positive(),
  message: z.string().optional(),
  isAnonymous: z.boolean().default(false),
  projectId: z.number().int().positive(),
});

export async function create(req: Request, res: Response) {
  const data = donationSchema.parse(req.body);
  const userId = req.user!.userId;

  // Proceso transaccional: crear donación + actualizar raised del proyecto
  const result = await prisma.$transaction(async (tx) => {
    const donation = await tx.donation.create({
      data: { ...data, userId },
      include: { project: true },
    });

    await tx.project.update({
      where: { id: data.projectId },
      data: { raised: { increment: data.amount } },
    });

    return donation;
  });

  res.status(201).json(result);
}

export async function myDonations(req: Request, res: Response) {
  const donations = await prisma.donation.findMany({
    where: { userId: req.user!.userId },
    include: { project: { select: { title: true, country: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json(donations);
}

export async function listByProject(req: Request, res: Response) {
  const projectId = Number(req.params.projectId);
  const donations = await prisma.donation.findMany({
    where: { projectId },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json(donations);
}