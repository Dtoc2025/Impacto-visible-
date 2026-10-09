import { Request, Response } from 'express';
import { prisma } from '../config/db.js';

export async function stats(_req: Request, res: Response) {
  const [totalRaised, totalDonations, activeProjects, totalUsers] = await Promise.all([
    prisma.donation.aggregate({ _sum: { amount: true } }),
    prisma.donation.count(),
    prisma.project.count(),
    prisma.user.count(),
  ]);

  res.json({
    totalRaised: Number(totalRaised._sum.amount || 0),
    totalDonations,
    activeProjects,
    totalUsers,
  });
}

export async function byCategory(_req: Request, res: Response) {
  const data = await prisma.category.findMany({
    include: {
      projects: {
        include: {
          donations: { select: { amount: true } },
        },
      },
    },
  });

  const result = data.map((c) => ({
    category: c.name,
    total: c.projects.reduce(
      (sum, p) => sum + p.donations.reduce((s, d) => s + Number(d.amount), 0),
      0
    ),
  }));

  res.json(result);
}