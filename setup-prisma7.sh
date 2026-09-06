#!/bin/bash
echo "Starting GameLobby Setup with Prisma 7..."

cd /Users/felixcobbinah/Downloads/game-lobby

# Create Prisma config file (new in Prisma 7)
cat > backend/prisma.config.ts << 'CONFIGEOF'
import { defineConfig } from 'prisma/config';

export default defineConfig({
  migrations: {
    seed: 'ts-node prisma/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
CONFIGEOF

# Update Prisma schema (remove url property)
cat > backend/prisma/schema.prisma << 'SCHEMAEOF'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String
  name          String
  role          Role      @default(USER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  sessions      Session[]
  accounts      Account[]
  games         GamePlay[]
  @@map("users")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@map("sessions")
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
  @@map("accounts")
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
  gamePlays   GamePlay[]
  @@map("games")
}

enum Role {
  USER
  MODERATOR
  ADMIN
}
SCHEMAEOF

# Create .env file
cat > backend/.env << 'ENVEOF'
DATABASE_URL="postgresql://neondb_owner:npg_dv0bKogpRh2m@ep-wispy-bird-ayzswudn-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
JWT_SECRET="your-super-secret-jwt-key"
FRONTEND_URL="http://localhost:3000"
PORT=4000
ENVEOF

# Create Prisma client
cat > backend/src/lib/prisma.ts << 'PRISMAEOF'
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
PRISMAEOF

# Create seed file
cat > backend/prisma/seed.ts << 'SEEDEOF'
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

  const modEmail = 'moderator@gamelobby.com';
  const existingMod = await prisma.user.findUnique({
    where: { email: modEmail },
  });

  if (!existingMod) {
    const hashedPassword = await bcrypt.hash('moderator123', 10);
    await prisma.user.create({
      data: {
        email: modEmail,
        password: hashedPassword,
        name: 'Moderator User',
        role: 'MODERATOR',
      },
    });
    console.log('Moderator user created');
  }

  const testEmail = 'user@gamelobby.com';
  const existingTest = await prisma.user.findUnique({
    where: { email: testEmail },
  });

  if (!existingTest) {
    const hashedPassword = await bcrypt.hash('user123', 10);
    await prisma.user.create({
      data: {
        email: testEmail,
        password: hashedPassword,
        name: 'Test User',
        role: 'USER',
      },
    });
    console.log('Test user created');
  }

  const gameCount = await prisma.game.count();
  
  if (gameCount === 0) {
    console.log('Seeding games...');
    
    const games = [
      { id: '1', title: 'Cyberpunk Legends', category: 'Slots', rating: 4.9, plays: 8543, description: 'Step into the neon-drenched future with cyberpunk-themed slots.', imageUrl: '/images/games/cyberpunk-game.png', provider: 'Neon Gaming Studios', isLive: true, features: ['Jackpot', 'Free Spins', 'Wild Symbols'], jackpot: '1,250,000kr' },
      { id: '2', title: 'Lucky Fortune', category: 'Slots', rating: 4.8, plays: 12345, description: 'Spin the wheel of fortune with lucky symbols and massive multipliers.', imageUrl: '/images/games/fortune-game.png', provider: 'Fortune Gaming', isLive: true, features: ['Mega Jackpot', 'Free Spins', 'Multipliers'], jackpot: '1,250,000kr' },
      { id: '3', title: 'Dragon Slayer', category: 'Slots', rating: 4.7, plays: 9876, description: 'Slay the dragon and claim the treasure in this epic fantasy slot.', imageUrl: '/images/games/dragon-game.png', provider: 'Epic Gaming', isLive: true, features: ['Bonus Rounds', 'Scatter', 'Wild Symbols'], jackpot: '250,000kr' },
      { id: '4', title: "Texas Hold'em Poker", category: 'Table Games', rating: 4.6, plays: 6543, description: 'Professional poker experience with live dealers and real-time multiplayer.', imageUrl: '/images/games/poker-game.png', provider: 'Live Gaming Studios', isLive: true, features: ['Live Dealers', 'Multiplayer', 'Tournaments'], jackpot: '250,000kr' },
      { id: '5', title: 'Space Commander', category: 'Slots', rating: 4.9, plays: 13456, description: 'Explore the galaxy with space-themed slots and cosmic jackpots.', imageUrl: '/images/games/space-game.png', provider: 'Stellar Gaming', isLive: true, features: ['Galaxy Jackpot', 'Bonus Rounds', 'Free Spins'], jackpot: '250,000kr' },
      { id: '6', title: 'Starburst Galaxy', category: 'Slots', rating: 4.5, plays: 8765, description: 'Classic space adventure with expanding wilds and re-spins.', imageUrl: '/images/games/space-game.png', provider: 'Stellar Gaming', isLive: true, features: ['Expanding Wilds', 'Re-spins', 'High Volatility'] },
      { id: '7', title: 'Poker Royal', category: 'Table Games', rating: 4.4, plays: 4321, description: 'High-stakes poker with VIP tables and exclusive tournaments.', imageUrl: '/images/games/poker-game.png', provider: 'Card Masters', isLive: true, features: ['VIP Tables', 'Side Bets', 'Multi-Hand'] },
      { id: '8', title: "Dragon's Fortune", category: 'Slots', rating: 4.3, plays: 7654, description: 'Epic fantasy slot with dragon-themed bonuses and free spins.', imageUrl: '/images/games/dragon-game.png', provider: 'Epic Gaming', isLive: true, features: ['Bonus Rounds', 'Free Spins', 'Progressive Jackpot'] },
    ];

    for (const game of games) {
      await prisma.game.create({ data: game });
    }
    console.log(games.length + ' games seeded successfully');
  }

  console.log('Database seeding completed successfully!');
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

# Update backend package.json
cat > backend/package.json << 'PKGEOF'
{
  "name": "game-lobby-backend",
  "version": "1.0.0",
  "scripts": {
    "dev": "ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "prisma:generate": "prisma generate",
    "prisma:push": "prisma db push",
    "prisma:seed": "ts-node prisma/seed.ts"
  },
  "dependencies": {
    "@apollo/server": "^4.10.0",
    "@prisma/client": "^6.0.0",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.0",
    "express": "^4.18.0",
    "graphql": "^16.14.2",
    "graphql-tag": "^2.12.7",
    "jsonwebtoken": "^9.0.2",
    "prisma": "^6.0.0"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/node": "^20.11.0",
    "ts-node": "^10.9.0",
    "typescript": "^5.3.0"
  },
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
PKGEOF

# Clean install
cd backend
rm -rf node_modules package-lock.json
npm install

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push --accept-data-loss

# Run seed
npm run prisma:seed

# Test connection
echo "Testing database connection..."
node -e '
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
(async () => {
  try {
    await prisma.$connect();
    console.log("Successfully connected to Neon PostgreSQL");
    const userCount = await prisma.user.count();
    console.log("Total Users:", userCount);
    const gameCount = await prisma.game.count();
    console.log("Total Games:", gameCount);
    await prisma.$disconnect();
  } catch (error) {
    console.error("Connection failed:", error.message);
    process.exit(1);
  }
})();
'

cd ..

echo ""
echo "========================================="
echo "Setup Complete!"
echo "========================================="
echo ""
echo "Login Credentials:"
echo "Admin: admin@gamelobby.com / admin123"
echo "Moderator: moderator@gamelobby.com / moderator123"
echo "User: user@gamelobby.com / user123"
echo ""
echo "Start the application:"
echo "1. Backend: cd backend && npm run dev"
echo "2. Frontend: cd frontend && npm run dev"
echo "3. Visit: http://localhost:3000"
