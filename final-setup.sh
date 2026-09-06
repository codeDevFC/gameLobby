#!/bin/bash
echo "========================================="
echo "  GameLobby - Complete Fresh Setup"
echo "========================================="

cd /Users/felixcobbinah/Downloads/game-lobby/backend

# Clean everything
echo "Cleaning old files..."
rm -rf node_modules package-lock.json .prisma prisma/migrations

# Create .env
echo "Creating .env file..."
cat > .env << 'ENVEOF'
DATABASE_URL="postgresql://neondb_owner:npg_dv0bKogpRh2m@ep-wispy-bird-ayzswudn-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
JWT_SECRET="your-super-secret-jwt-key"
FRONTEND_URL="http://localhost:3000"
PORT=4000
ENVEOF

# Create schema.prisma
echo "Creating schema.prisma..."
cat > prisma/schema.prisma << 'SCHEMAEOF'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  role      String   @default("USER")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("users")
}

model Game {
  id          String   @id @default(cuid())
  title       String
  description String
  category    String
  rating      Float    @default(0)
  plays       Int      @default(0)
  imageUrl    String
  provider    String
  isLive      Boolean  @default(false)
  features    String[]
  jackpot     String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("games")
}

model GamePlay {
  id        String   @id @default(cuid())
  userId    String
  gameId    String
  playedAt  DateTime @default(now())
  duration  Int?
  score     Int?
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  game      Game     @relation(fields: [gameId], references: [id], onDelete: Cascade)
  
  @@map("game_plays")
}
SCHEMAEOF

# Create seed.ts
echo "Creating seed.ts..."
mkdir -p prisma
cat > prisma/seed.ts << 'SEEDEOF'
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create admin user
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
    console.log('✅ Admin user created');
  }

  // Create games
  const games = [
    {
      id: '1',
      title: 'Cyberpunk Legends',
      category: 'Slots',
      rating: 4.9,
      plays: 8543,
      description: 'Step into the neon-drenched future with cyberpunk-themed slots.',
      imageUrl: '/images/games/cyberpunk-game.png',
      provider: 'Neon Gaming Studios',
      isLive: true,
      features: ['Jackpot', 'Free Spins', 'Wild Symbols'],
      jackpot: '1,250,000kr',
    },
    {
      id: '2',
      title: 'Lucky Fortune',
      category: 'Slots',
      rating: 4.8,
      plays: 12345,
      description: 'Spin the wheel of fortune with lucky symbols and massive multipliers.',
      imageUrl: '/images/games/fortune-game.png',
      provider: 'Fortune Gaming',
      isLive: true,
      features: ['Mega Jackpot', 'Free Spins', 'Multipliers'],
      jackpot: '1,250,000kr',
    },
    {
      id: '3',
      title: 'Dragon Slayer',
      category: 'Slots',
      rating: 4.7,
      plays: 9876,
      description: 'Slay the dragon and claim the treasure in this epic fantasy slot.',
      imageUrl: '/images/games/dragon-game.png',
      provider: 'Epic Gaming',
      isLive: true,
      features: ['Bonus Rounds', 'Scatter', 'Wild Symbols'],
      jackpot: '250,000kr',
    },
    {
      id: '4',
      title: "Texas Hold'em Poker",
      category: 'Table Games',
      rating: 4.6,
      plays: 6543,
      description: 'Professional poker experience with live dealers and real-time multiplayer.',
      imageUrl: '/images/games/poker-game.png',
      provider: 'Live Gaming Studios',
      isLive: true,
      features: ['Live Dealers', 'Multiplayer', 'Tournaments'],
      jackpot: '250,000kr',
    },
    {
      id: '5',
      title: 'Space Commander',
      category: 'Slots',
      rating: 4.9,
      plays: 13456,
      description: 'Explore the galaxy with space-themed slots and cosmic jackpots.',
      imageUrl: '/images/games/space-game.png',
      provider: 'Stellar Gaming',
      isLive: true,
      features: ['Galaxy Jackpot', 'Bonus Rounds', 'Free Spins'],
      jackpot: '250,000kr',
    },
  ];

  for (const game of games) {
    const existing = await prisma.game.findUnique({
      where: { id: game.id },
    });
    if (!existing) {
      await prisma.game.create({ data: game });
      console.log(`✅ Game created: ${game.title}`);
    }
  }

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
SEEDEOF

# Create package.json
echo "Creating package.json..."
cat > package.json << 'PKGEOF'
{
  "name": "game-lobby-backend",
  "version": "1.0.0",
  "scripts": {
    "dev": "ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "@prisma/client": "^5.22.0",
    "bcryptjs": "^2.4.3",
    "prisma": "^5.22.0"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/node": "^20.11.0",
    "ts-node": "^10.9.0",
    "typescript": "^5.3.0"
  },
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
PKGEOF

# Install dependencies
echo "Installing dependencies..."
npm install

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Push schema to database
echo "Pushing schema to Neon PostgreSQL..."
npx prisma db push --accept-data-loss

# Run seed
echo "Seeding database..."
npx prisma db seed

# Test connection
echo "Testing database connection..."
node -e '
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
(async () => {
  try {
    await prisma.$connect();
    console.log("✅ Successfully connected to Neon PostgreSQL!");
    const userCount = await prisma.user.count();
    console.log("👥 Total Users:", userCount);
    const gameCount = await prisma.game.count();
    console.log("🎮 Total Games:", gameCount);
    await prisma.$disconnect();
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
    process.exit(1);
  }
})();
'

echo ""
echo "========================================="
echo "✅ Setup Complete!"
echo "========================================="
echo ""
echo "📋 Login Credentials:"
echo "  Admin: admin@gamelobby.com / admin123"
echo ""
echo "🚀 Start the backend:"
echo "  cd backend && npm run dev"
echo ""
echo "📊 Your Neon PostgreSQL is connected!"
