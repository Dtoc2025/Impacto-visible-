import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../config/db.js';
import { signToken } from '../utils/jwt.js';

const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(6),
  role: z.enum(['DONOR', 'ORG']).default('DONOR'),
  organizationName: z.string().optional(),
  country: z.string().optional(),
  website: z.string().optional(),
  bio: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function register(req: Request, res: Response) {
  const data = registerSchema.parse(req.body);

  const exists = await prisma.user.findUnique({ where: { email: data.email } });
  if (exists) return res.status(409).json({ message: 'El email ya está registrado' });

  if (data.role === 'ORG' && !data.organizationName) {
    return res.status(400).json({ message: 'Las organizaciones deben indicar su nombre' });
  }

  const hashed = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      password: hashed,
      role: data.role,
      organizationName: data.organizationName,
      country: data.country,
      website: data.website,
      bio: data.bio,
    },
  });

  const token = signToken({ userId: user.id, role: user.role });
  res.status(201).json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      organizationName: user.organizationName,
      country: user.country,
      avatarUrl: user.avatarUrl,
    },
  });
}

export async function login(req: Request, res: Response) {
  const data = loginSchema.parse(req.body);

  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });

  const valid = await bcrypt.compare(data.password, user.password);
  if (!valid) return res.status(401).json({ message: 'Credenciales inválidas' });

  const token = signToken({ userId: user.id, role: user.role });
  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      organizationName: user.organizationName,
      country: user.country,
      avatarUrl: user.avatarUrl,
    },
  });
}

export async function me(req: Request, res: Response) {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      organizationName: true,
      country: true,
      avatarUrl: true,
      website: true,
      bio: true,
      createdAt: true,
    },
  });
  res.json(user);
}

// Actualizar perfil
const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  organizationName: z.string().optional(),
  country: z.string().optional(),
  website: z.string().optional(),
  bio: z.string().optional(),
  avatarUrl: z.string().optional(),
});

export async function updateProfile(req: Request, res: Response) {
  const data = updateProfileSchema.parse(req.body);
  const user = await prisma.user.update({
    where: { id: req.user!.userId },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      organizationName: true,
      country: true,
      avatarUrl: true,
      website: true,
      bio: true,
    },
  });
  res.json(user);
}