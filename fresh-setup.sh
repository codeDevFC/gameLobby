#!/bin/bash
echo "Fresh Setup with Prisma 5..."

cd /Users/felixcobbinah/Downloads/game-lobby/backend

# Remove everything
rm -rf node_modules package-lock.json .prisma prisma/migrations

# Create .env
cat > .env << 'ENVEOF'
DATABASE_URL="postgresql://neondb_owner:npg_dv0bKogpRh2m@ep-wispy-bird-ayzswudn-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
JWT_SECRET="your-super-secret-jwt-key"
FRONTEND_URL="http://localhost:3000"
PORT=4000
ENVEOF

# Install Prisma 5
npm install prisma@5.22.0 @prisma/client@5.22.0

# Generate client
npx prisma generate

# Push schema
npx prisma db push --accept-data-loss

# Create seed file
cat > prisma/seed.ts << 'SEEDEOF'
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  const adminEmail = 'admin@gamelobby.com';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Admin User',
        role: 'ADMIN',
      },
    });
    console.log('Admin user created');
  }

  const games = [
    { id: '1', title: 'Cyberpunk Legends', category: 'Slots', rating: 4.9, plays: 8543, description: 'Step into the neon-drenched future with cyberpunk-themed slots.', imageUrl: '/images/games/cyberpunk-game.png', provider: 'Neon Gaming Studios', isLive: true, features: ['Jackpot', 'Free Spins', 'Wild Symbols'], jackpot: '1,250,000kr' },
    { id: '2', title: 'Lucky Fortune', category: 'Slots', rating: 4.8, plays: 12345, description: 'Spin the wheel of fortune with lucky symbols and massive multipliers.', imageUrl: '/images/games/fortune-game.png', provider: 'Fortune Gaming', isLive: true, features: ['Mega Jackpot', 'Free Spins', 'Multipliers'], jackpot: '1,250,000kr' },
  ];

  for (const game of games) {
    const exists = await prisma.game.findUnique({ where: { id: game.id } });
    if (!exists) {
      await prisma.game.create({ data: game });
    }
  }
  console.log('Games seeded successfully');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
SEEDEOF

# Update package.json with seed command
cat > package.json << 'PKGEOF'
{
  "name": "game-lobby-backend",
  "version": "1.0.0",
  "scripts": {
    "dev": "ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "prisma:generate": "prisma generate",
    "prisma:push": "prisma db push",
    "prisma:seed": "prisma db seed"
  },
  "dependencies": {
    "@apollo/server": "^4.10.0",
    "@prisma/client": "^5.22.0",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.0",
    "express": "^4.18.0",
    "graphql": "^16.14.2",
    "graphql-tag": "^2.12.7",
    "jsonwebtoken": "^9.0.2"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/node": "^20.11.0",
    "prisma": "^5.22.0",
    "ts-node": "^10.9.0",
    "typescript": "^5.3.0"
  },
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
PKGEOF

# Install all dependencies
npm install

# Generate and push
npx prisma generate
npx prisma db push --accept-data-loss

# Run seed
npx prisma db seed

echo "Setup Complete!"
