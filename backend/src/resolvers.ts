import { prisma } from './lib/prisma';

export const resolvers = {
  Query: {
    games: async () => {
      return prisma.game.findMany();
    },
    game: async (_: any, { id }: { id: string }) => {
      return prisma.game.findUnique({ where: { id } });
    },
    featuredGames: async (_: any, { limit = 4 }: { limit: number }) => {
      return prisma.game.findMany({
        orderBy: { rating: 'desc' },
        take: limit,
      });
    },
    users: async () => {
      return prisma.user.findMany();
    },
  },
  Mutation: {
    incrementGamePlays: async (_: any, { id }: { id: string }) => {
      return prisma.game.update({
        where: { id },
        data: { plays: { increment: 1 } },
      });
    },
  },
};
