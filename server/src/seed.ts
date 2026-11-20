import bcrypt from 'bcryptjs';
import { prisma } from './config/prisma';

async function seed() {
  console.log('Seeding initial demonstration data...');

  const demoEmail = 'demo.sales@merutech.in';
  const rawPassword = 'SalesLeader2026!';
  const hashedPassword = await bcrypt.hash(rawPassword, 12);

  // Upsert demonstration user
  const user = await prisma.user.upsert({
    where: { email: demoEmail },
    update: { password: hashedPassword },
    create: {
      name: 'Rajesh Malhotra',
      email: demoEmail,
      password: hashedPassword,
    },
  });

  console.log(`Demo user ready: ${user.email} (Password: ${rawPassword})`);

  // Seed sample leads for this user if none exist
  const existingLeads = await prisma.lead.count({ where: { userId: user.id } });
  if (existingLeads === 0) {
    const sampleLeads = [
      {
        name: 'Rahul Sharma',
        email: 'rahul.sharma@acmecorp.in',
        phone: '+91 98765 43210',
        company: 'Acme Corp Technologies',
        source: 'Website',
        status: 'New',
        userId: user.id,
      },
      {
        name: 'Priya Nair',
        email: 'priya.nair@fintechnow.co',
        phone: '+91 98222 33445',
        company: 'FinTech Horizons',
        source: 'LinkedIn',
        status: 'Contacted',
        userId: user.id,
      },
      {
        name: 'Vikram Singhania',
        email: 'vikram.s@apexglobal.in',
        phone: '+91 98333 44556',
        company: 'Apex Global Logistics',
        source: 'Referral',
        status: 'Qualified',
        userId: user.id,
      },
      {
        name: 'Ananya Verma',
        email: 'ananya.v@zenithcloud.io',
        phone: '+91 98444 55667',
        company: 'Zenith Cloud Labs',
        source: 'Cold Outreach',
        status: 'Qualified',
        userId: user.id,
      },
      {
        name: 'Karan Mehta',
        email: 'karan.mehta@vertexretail.com',
        phone: '+91 98555 66778',
        company: 'Vertex Retail Systems',
        source: 'Event',
        status: 'New',
        userId: user.id,
      },
      {
        name: 'Sneha Roy',
        email: 'sneha.roy@novabio.org',
        phone: '+91 98666 77889',
        company: 'Nova Bio Innovations',
        source: 'Website',
        status: 'Lost',
        userId: user.id,
      },
      {
        name: 'Arjun Das',
        email: 'arjun.das@quantumpay.in',
        phone: '+91 98777 88990',
        company: 'Quantum Payments Ltd',
        source: 'LinkedIn',
        status: 'Contacted',
        userId: user.id,
      },
      {
        name: 'Meera Joshi',
        email: 'meera.j@strataanalytics.com',
        phone: '+91 98888 99001',
        company: 'Strata Analytics',
        source: 'Other',
        status: 'New',
        userId: user.id,
      },
    ];

    for (const lead of sampleLeads) {
      await prisma.lead.create({ data: lead });
    }

    console.log(`Successfully seeded ${sampleLeads.length} sample leads for ${user.email}`);
  } else {
    console.log(`Demo user already has ${existingLeads} leads.`);
  }

  await prisma.$disconnect();
  console.log('Database seeding complete.');
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
