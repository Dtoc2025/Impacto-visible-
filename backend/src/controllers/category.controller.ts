import { Request, Response } from 'express';
import { prisma } from '../config/db.js';

export async function list(_req: Request, res: Response) {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { projects: true } } },
  });
  res.json(categories);
}