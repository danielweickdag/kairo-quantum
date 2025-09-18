import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create demo user
  const demoUserEmail = 'demo@kairo.com';
  const demoUserPassword = 'demo123';
  
  // Check if demo user already exists
  const existingDemoUser = await prisma.user.findUnique({
    where: { email: demoUserEmail },
  });

  if (existingDemoUser) {
    console.log('✅ Demo user already exists');
  } else {
    // Hash the demo password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(demoUserPassword, saltRounds);

    // Create demo user
    const demoUser = await prisma.user.create({
      data: {
        email: demoUserEmail,
        username: 'demo_user',
        firstName: 'Demo',
        lastName: 'User',
        passwordHash,
        accountType: 'INDIVIDUAL',
        isVerified: true,
        isPublic: true,
        totalBalance: 100000.0, // $100,000 demo balance
        availableBalance: 100000.0,
        bio: 'Demo account for testing KAIRO trading platform',
      },
    });

    console.log('✅ Demo user created:', {
      id: demoUser.id,
      email: demoUser.email,
      username: demoUser.username,
    });

    // Create a demo portfolio for the user
    const demoPortfolio = await prisma.portfolio.create({
      data: {
        name: 'Demo Portfolio',
        description: 'Sample portfolio for demonstration purposes',
        userId: demoUser.id,
        totalValue: 100000.0,
        totalReturn: 0.0,
        totalReturnPct: 0.0,
        isPublic: true,
      },
    });

    console.log('✅ Demo portfolio created:', {
      id: demoPortfolio.id,
      name: demoPortfolio.name,
    });
  }

  // Create additional sample users for social features
  const sampleUsers = [
    {
      email: 'warren.buffett@kairo.com',
      username: 'warren_buffett',
      firstName: 'Warren',
      lastName: 'Buffett',
      accountType: 'CELEBRITY' as const,
      isVerified: true,
      bio: 'Chairman and CEO of Berkshire Hathaway. Value investing legend.',
      totalBalance: 50000000.0,
      availableBalance: 10000000.0,
    },
    {
      email: 'cathie.wood@kairo.com',
      username: 'cathie_wood',
      firstName: 'Cathie',
      lastName: 'Wood',
      accountType: 'HEDGE_FUND' as const,
      isVerified: true,
      bio: 'CEO of ARK Invest. Focused on disruptive innovation.',
      totalBalance: 25000000.0,
      availableBalance: 5000000.0,
    },
    {
      email: 'ray.dalio@kairo.com',
      username: 'ray_dalio',
      firstName: 'Ray',
      lastName: 'Dalio',
      accountType: 'HEDGE_FUND' as const,
      isVerified: true,
      bio: 'Founder of Bridgewater Associates. Principles-based investing.',
      totalBalance: 75000000.0,
      availableBalance: 15000000.0,
    },
  ];

  for (const userData of sampleUsers) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (!existingUser) {
      const passwordHash = await bcrypt.hash('samplepass123', 12);
      
      const user = await prisma.user.create({
        data: {
          ...userData,
          passwordHash,
        },
      });

      // Create a portfolio for each sample user
      await prisma.portfolio.create({
        data: {
          name: `${userData.firstName}'s Portfolio`,
          description: `Investment portfolio managed by ${userData.firstName} ${userData.lastName}`,
          userId: user.id,
          totalValue: userData.totalBalance,
          totalReturn: Math.random() * 20000 - 10000, // Random return between -10k and +10k
          totalReturnPct: (Math.random() * 40 - 20), // Random percentage between -20% and +20%
          isPublic: true,
        },
      });

      console.log(`✅ Sample user created: ${userData.username}`);
    } else {
      console.log(`✅ Sample user already exists: ${userData.username}`);
    }
  }

  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });