import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/db.js';

const projectSchema = z.object({
  title: z.string().min(3),
  subtitle: z.string().optional(),
  description: z.string().min(10),
  impact: z.string().optional(),
  beneficiaries: z.number().int().positive().optional(),
  country: z.string().min(2),
  region: z.string().optional(),
  urgency: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
  isForgotten: z.boolean().default(false),
  goal: z.number().positive(),
  imageUrl: z.string().optional(),
  gallery: z.array(z.string()).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  categoryId: z.number().int().positive(),
});

export async function list(req: Request, res: Response) {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const category = req.query.category as string | undefined;
  const country = req.query.country as string | undefined;
  const forgotten = req.query.forgotten === 'true';
  const search = req.query.search as string | undefined;
  const urgency = req.query.urgency as string | undefined;

  const where: any = {};
  if (category) where.category = { slug: category };
  if (country) where.country = country;
  if (forgotten) where.isForgotten = true;
  if (urgency) where.urgency = urgency;
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
      { country: { contains: search } },
    ];
  }

  const [total, items] = await Promise.all([
    prisma.project.count({ where }),
    prisma.project.findMany({
      where,
      include: {
        category: true,
        organizer: { select: { id: true, name: true, organizationName: true, avatarUrl: true } },
        _count: { select: { donations: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  res.json({ total, page, limit, items });
}

export async function getById(req: Request, res: Response) {
  const id = Number(req.params.id);
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      category: true,
      organizer: { select: { id: true, name: true, organizationName: true, avatarUrl: true, website: true, bio: true } },
      donations: {
        include: { user: { select: { id: true, name: true, avatarUrl: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  });
  if (!project) return res.status(404).json({ message: 'Proyecto no encontrado' });

  // Ocultar nombre si es anónima
  const sanitized = {
    ...project,
    donations: project.donations.map((d) => ({
      ...d,
      user: d.isAnonymous ? null : d.user,
    })),
  };

  res.json(sanitized);
}

export async function create(req: Request, res: Response) {
  const data = projectSchema.parse(req.body);
  const organizerId = req.user!.role === 'ORG' ? req.user!.userId : undefined;

  const project = await prisma.project.create({
    data: { ...data, organizerId },
    include: { category: true, organizer: { select: { id: true, name: true, organizationName: true } } },
  });
  res.status(201).json(project);
}

export async function update(req: Request, res: Response) {
  const id = Number(req.params.id);
  const data = projectSchema.partial().parse(req.body);

  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ message: 'Proyecto no encontrado' });

  // ORG solo puede editar los suyos
  if (req.user!.role === 'ORG' && existing.organizerId !== req.user!.userId) {
    return res.status(403).json({ message: 'No puedes editar proyectos de otra organización' });
  }

  const project = await prisma.project.update({
    where: { id },
    data,
    include: { category: true },
  });
  res.json(project);
}

export async function remove(req: Request, res: Response) {
  const id = Number(req.params.id);

  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ message: 'Proyecto no encontrado' });

  if (req.user!.role === 'ORG' && existing.organizerId !== req.user!.userId) {
    return res.status(403).json({ message: 'No puedes eliminar proyectos de otra organización' });
  }

  await prisma.project.delete({ where: { id } });
  res.status(204).send();
}

// Proyectos del usuario logueado (ORG)
export async function mine(req: Request, res: Response) {
  const projects = await prisma.project.findMany({
    where: { organizerId: req.user!.userId },
    include: {
      category: true,
      _count: { select: { donations: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json(projects);
}