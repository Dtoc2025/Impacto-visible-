import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt.js';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authRequired(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token requerido' });
  }
  const token = header.slice(7);
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
}

export function adminRequired(req: Request, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Acceso denegado: se requiere rol ADMIN' });
  }
  next();
}

// ADMIN o ORG pueden crear proyectos
export function orgOrAdminRequired(req: Request, res: Response, next: NextFunction) {
  if (!req.user || (req.user.role !== 'ADMIN' && req.user.role !== 'ORG')) {
    return res.status(403).json({ message: 'Acceso denegado: se requiere rol ADMIN u ORG' });
  }
  next();
}