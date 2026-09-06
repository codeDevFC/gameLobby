import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🖼️ Updating game images with absolute URLs...');

  const imageMap = {
    '1': '/images/games/cyberpunk-game.png',
    '2': '/images/games/fortune-game.png',
    '3': '/images/games/dragon-game.png',
    '4': '/images/games/poker-game.png',
    '5': '/images/games/space-game.png',
    '6': '/images/games/space-game.png',
    '7': '/images/games/poker-game.png',
    '8': '/images/games/dragon-game.png',
  };

  for (const [id, imageUrl] of Object.entries(imageMap)) {
    await prisma.game.update({
      where: { id },
      data: { imageUrl },
    });
    console.log(`✅ Updated game ${id} with image: ${imageUrl}`);
  }

  console.log('✅ All images updated successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Update failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
