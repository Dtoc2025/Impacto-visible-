import { PrismaClient, Role, Urgency } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log(' Iniciando seed...');

  await prisma.donation.deleteMany();
  await prisma.project.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // ============ USUARIOS ============
  const adminPassword = await bcrypt.hash('admin123', 10);
  const donorPassword = await bcrypt.hash('donor123', 10);
  const orgPassword = await bcrypt.hash('org123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@impacto.com',
      name: 'Admin Impacto',
      password: adminPassword,
      role: Role.ADMIN,
      country: 'Global',
    },
  });

  const donor = await prisma.user.create({
    data: {
      email: 'donor@impacto.com',
      name: 'María Donante',
      password: donorPassword,
      role: Role.DONOR,
      country: 'México',
      bio: 'Apasionada por causas humanitarias',
    },
  });

  const org1 = await prisma.user.create({
    data: {
      email: 'medicos@impacto.com',
      name: 'Dr. Carlos Ramírez',
      password: orgPassword,
      role: Role.ORG,
      organizationName: 'Médicos Sin Fronteras',
      country: 'España',
      website: 'https://msf.org',
      bio: 'Organización internacional de ayuda médica humanitaria.',
    },
  });

  const org2 = await prisma.user.create({
    data: {
      email: 'agua@impacto.com',
      name: 'Ana López',
      password: orgPassword,
      role: Role.ORG,
      organizationName: 'Agua Para Todos',
      country: 'Colombia',
      website: 'https://aguaparatodos.org',
      bio: 'Llevamos agua potable a comunidades vulnerables.',
    },
  });

  console.log(` Usuarios creados`);

  // ============ CATEGORÍAS ============
  await prisma.category.createMany({
    data: [
      { name: 'Alimentación', slug: 'alimentacion', description: 'Ayuda alimentaria y nutrición', icon: '🍞', color: '#F59E0B' },
      { name: 'Salud', slug: 'salud', description: 'Atención médica y medicamentos', icon: '🏥', color: '#EF4444' },
      { name: 'Educación', slug: 'educacion', description: 'Acceso a educación y materiales', icon: '📚', color: '#3B82F6' },
      { name: 'Agua', slug: 'agua', description: 'Agua potable y saneamiento', icon: '💧', color: '#06B6D4' },
      { name: 'Refugio', slug: 'refugio', description: 'Vivienda y albergue de emergencia', icon: '🏠', color: '#8B5CF6' },
      { name: 'Emergencias', slug: 'emergencias', description: 'Respuesta a desastres naturales', icon: '🚨', color: '#DC2626' },
    ],
  });

  const catAlimentacion = await prisma.category.findUnique({ where: { slug: 'alimentacion' } });
  const catSalud = await prisma.category.findUnique({ where: { slug: 'salud' } });
  const catEducacion = await prisma.category.findUnique({ where: { slug: 'educacion' } });
  const catAgua = await prisma.category.findUnique({ where: { slug: 'agua' } });
  const catRefugio = await prisma.category.findUnique({ where: { slug: 'refugio' } });
  const catEmergencias = await prisma.category.findUnique({ where: { slug: 'emergencias' } });

  console.log(` Categorías creadas`);

  // ============ PROYECTOS ============
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        title: 'Alimentación para familias en Gaza',
        subtitle: 'Canastas básicas para 500 familias desplazadas',
        description: 'Distribución de canastas básicas de alimentos no perecederos, agua potable y kits de higiene para familias que han perdido sus hogares en el conflicto. Cada canasta cubre las necesidades de una familia de 5 personas durante 2 semanas.',
        impact: 'Con tu donación garantizamos alimentación y agua a familias que lo han perdido todo. Cada $50 alimenta a una familia completa durante 15 días.',
        beneficiaries: 2500,
        country: 'Palestina',
        region: 'Gaza',
        urgency: Urgency.CRITICAL,
        isForgotten: true,
        goal: 50000,
        raised: 12400,
        imageUrl: 'https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=1200',
        gallery: [
          'https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=1200',
          'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200',
          'https://images.unsplash.com/photo-1541802645635-11f2286a7482?w=1200'
        ],
        latitude: 31.5017,
        longitude: 34.4668,
        categoryId: catAlimentacion!.id,
        organizerId: org1.id,
      },
    }),
    prisma.project.create({
      data: {
        title: 'Medicamentos para hospital en Sudán',
        subtitle: 'Suministros médicos esenciales para 200 niños',
        description: 'Suministro de medicamentos esenciales, vacunas y material quirúrgico para el hospital infantil de Darfur, que atiende a más de 200 niños diariamente en condiciones precarias.',
        impact: 'Tu donación salva vidas de niños que no tienen acceso a medicamentos básicos. $25 = medicamentos para 5 niños durante una semana.',
        beneficiaries: 800,
        country: 'Sudán',
        region: 'Darfur',
        urgency: Urgency.CRITICAL,
        isForgotten: true,
        goal: 30000,
        raised: 6800,
        imageUrl: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=1200',
        gallery: [
          'https://images.unsplash.com/photo-1584515933487-779824d29309?w=1200',
          'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=1200'
        ],
        latitude: 13.5053,
        longitude: 24.8875,
        categoryId: catSalud!.id,
        organizerId: org1.id,
      },
    }),
    prisma.project.create({
      data: {
        title: 'Escuelas rurales en Yemen',
        subtitle: 'Reconstrucción de 3 escuelas destruidas',
        description: 'Reconstrucción completa de 3 escuelas destruidas por el conflicto, incluyendo aulas, baños, mobiliario y material educativo. Más de 500 niños podrán volver a estudiar.',
        impact: 'Cada escuela reconstruida da acceso a educación a más de 150 niños. $100 = un mes de material educativo para una clase completa.',
        beneficiaries: 500,
        country: 'Yemen',
        region: 'Sanaa',
        urgency: Urgency.HIGH,
        isForgotten: true,
        goal: 45000,
        raised: 9200,
        imageUrl: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=1200',
        gallery: [
          'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=1200',
          'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200'
        ],
        latitude: 15.3694,
        longitude: 44.1910,
        categoryId: catEducacion!.id,
        organizerId: org1.id,
      },
    }),
    prisma.project.create({
      data: {
        title: 'Agua potable en Haití',
        subtitle: 'Pozos y sistemas de purificación',
        description: 'Instalación de 5 pozos de agua y sistemas de purificación en comunidades rurales sin acceso a agua potable. Cada pozo beneficia a más de 300 personas.',
        impact: 'El acceso a agua potable reduce enfermedades y muertes infantiles. $50 = agua limpia para una familia durante un año.',
        beneficiaries: 1500,
        country: 'Haití',
        region: 'Puerto Príncipe',
        urgency: Urgency.HIGH,
        isForgotten: false,
        goal: 25000,
        raised: 15800,
        imageUrl: 'https://images.unsplash.com/photo-1541544537156-7627a7a4aa1c?w=1200',
        gallery: [
          'https://images.unsplash.com/photo-1541544537156-7627a7a4aa1c?w=1200',
          'https://images.unsplash.com/photo-1594398901394-4e34939a4fd0?w=1200'
        ],
        latitude: 18.5944,
        longitude: -72.3074,
        categoryId: catAgua!.id,
        organizerId: org2.id,
      },
    }),
    prisma.project.create({
      data: {
        title: 'Refugio para desplazados en Ucrania',
        subtitle: 'Albergues temporales para 300 familias',
        description: 'Construcción y equipamiento de albergues temporales para familias desplazadas por la guerra. Incluye camas, calefacción, baños y cocina comunitaria.',
        impact: 'Cada refugio alberga a 30 familias durante el invierno. $75 = una cama completa con cobijas y almohada.',
        beneficiaries: 900,
        country: 'Ucrania',
        region: 'Kharkiv',
        urgency: Urgency.HIGH,
        isForgotten: false,
        goal: 60000,
        raised: 42000,
        imageUrl: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=1200',
        gallery: [
          'https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=1200'
        ],
        latitude: 49.9935,
        longitude: 36.2304,
        categoryId: catRefugio!.id,
        organizerId: org2.id,
      },
    }),
    prisma.project.create({
      data: {
        title: 'Nutrición infantil en Venezuela',
        subtitle: 'Programa de alimentación para 200 niños',
        description: 'Programa integral de nutrición para niños menores de 12 años en situación de vulnerabilidad. Incluye suplementos alimenticios, controles médicos y talleres de educación nutricional para las familias.',
        impact: 'Reducimos la desnutrición infantil con seguimiento médico y alimentación adecuada. $30 = un mes completo de nutrición para un niño.',
        beneficiaries: 200,
        country: 'Venezuela',
        region: 'Caracas',
        urgency: Urgency.MEDIUM,
        isForgotten: true,
        goal: 20000,
        raised: 3400,
        imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200',
        gallery: [
          'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200',
          'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=1200'
        ],
        latitude: 10.4806,
        longitude: -66.9036,
        categoryId: catAlimentacion!.id,
        organizerId: org1.id,
      },
    }),
    prisma.project.create({
      data: {
        title: 'Respuesta a terremoto en Turquía',
        subtitle: 'Ayuda inmediata para damnificados',
        description: 'Respuesta de emergencia tras el terremoto: distribución de tiendas de campaña, mantas, comida y agua. Apoyo psicológico para niños y familias afectadas.',
        impact: 'Ayuda inmediata a las víctimas del terremoto en las primeras 72 horas críticas.',
        beneficiaries: 2000,
        country: 'Turquía',
        region: 'Gaziantep',
        urgency: Urgency.CRITICAL,
        isForgotten: false,
        goal: 80000,
        raised: 65000,
        imageUrl: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1200',
        gallery: [
          'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1200'
        ],
        latitude: 37.0662,
        longitude: 37.3833,
        categoryId: catEmergencias!.id,
        organizerId: org1.id,
      },
    }),
  ]);

  console.log(` Proyectos creados: ${projects.length}`);

  // ============ DONACIONES ============
  await prisma.donation.createMany({
    data: [
      { amount: 100, message: 'Ánimo con esta causa', userId: donor.id, projectId: projects[0].id },
      { amount: 50, message: 'Por los niños', userId: donor.id, projectId: projects[1].id },
      { amount: 25, isAnonymous: true, userId: donor.id, projectId: projects[2].id },
      { amount: 200, message: 'Con cariño', userId: donor.id, projectId: projects[3].id },
      { amount: 75, userId: donor.id, projectId: projects[4].id },
      { amount: 30, message: 'Para los más pequeños', userId: donor.id, projectId: projects[5].id },
      { amount: 500, message: 'Ayuda urgente', userId: admin.id, projectId: projects[6].id },
    ],
  });

  console.log(` Donaciones creadas`);
  console.log('');
  console.log(' Seed completado exitosamente');
  console.log('');
  console.log('Credenciales de prueba:');
  console.log('  Admin: admin@impacto.com / admin123');
  console.log('  Donor: donor@impacto.com / donor123');
  console.log('  Org 1: medicos@impacto.com / org123');
  console.log('  Org 2: agua@impacto.com / org123');
}

main()
  .catch((e) => {
    console.error('Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });