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
