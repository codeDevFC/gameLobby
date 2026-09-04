import { games } from '../data/games';

export const resolvers = {
  Query: {
    games: () => games,
    game: (_: any, { id }: { id: string }) => games.find(g => g.id === id),
    featuredGames: (_: any, { limit = 4 }: { limit: number }) =>
      [...games].sort((a, b) => b.rating - a.rating).slice(0, limit),
    categories: () => [...new Set(games.map(g => g.category))]
  },
  Mutation: {
    incrementGamePlays: (_: any, { id }: { id: string }) => {
      const game = games.find(g => g.id === id);
      if (game) game.plays += 1;
      return game;
    }
  }
};
