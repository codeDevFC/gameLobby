'use client';

import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql, HttpLink } from '@apollo/client';
import { useState, useEffect } from 'react';

// Create Apollo Client with environment variable or fallback
const getClient = () => {
  const uri = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'https://game-lobby-kou8ncbmo-felix-cobbinahs-projects.vercel.app/graphql';
  return new ApolloClient({
    link: new HttpLink({ uri }),
    cache: new InMemoryCache(),
  });
};

const client = getClient();

// GraphQL Query
const GET_GAMES = gql`
  query GetGames {
    games {
      id
      title
      description
      category
      rating
      plays
      imageUrl
      provider
      isLive
      features
      jackpot
    }
  }
`;

// Fallback games
const fallbackGames = [
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

function HomePage() {
  const { data, loading, error } = useQuery(GET_GAMES);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A1628] flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Loading games...</div>
      </div>
    );
  }

  const games = data?.games || fallbackGames;

  return (
    <div className="min-h-screen bg-[#0A1628] p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Game<span className="text-[#FECC02]">Lobby</span>
              </h1>
              <p className="text-[#B0C4DE]">🇸🇪 Stockholm · Premium Gaming</p>
            </div>
            <div className="bg-[#112240] px-4 py-2 rounded-full border border-[#1A3355]">
              <span className="text-[#B0C4DE]">🎮 {games.length} Games</span>
            </div>
          </div>
        </header>

        <div className="w-full h-1 bg-gradient-to-r from-[#005B99] via-[#FECC02] to-[#005B99] rounded-full mb-8"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {games.map((game) => (
            <div key={game.id} className="group bg-[#112240] rounded-lg overflow-hidden border border-[#1A3355] hover:border-[#FECC02] transition-all duration-300 hover:scale-[1.02]">
              <div className="aspect-video relative bg-[#0A1628]">
                <img
                  src={game.imageUrl}
                  alt={game.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1614294149010-950b698f7180?w=400&h=300&fit=crop';
                  }}
                />
                {game.isLive && (
                  <span className="absolute top-3 left-3 bg-[#FECC02] text-[#0A1628] text-xs font-bold px-2.5 py-1 rounded-full animate-pulse">
                    LIVE
                  </span>
                )}
                <div className="absolute bottom-3 right-3 bg-[#0A1628]/80 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <span className="text-[#FECC02]">⭐</span>
                  <span className="text-white text-sm font-semibold">{game.rating}</span>
                </div>
                <div className="absolute bottom-3 left-3 bg-[#0A1628]/80 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <span className="text-[#B0C4DE] text-xs">👾</span>
                  <span className="text-white text-xs">{game.plays.toLocaleString()}</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-white font-semibold text-base truncate">{game.title}</h3>
                <p className="text-[#B0C4DE] text-sm mt-1 line-clamp-2">{game.description}</p>
                <div className="flex items-center flex-wrap gap-2 mt-3">
                  <span className="text-xs px-2.5 py-1 bg-[#0A1628] border border-[#1A3355] rounded-full text-[#B0C4DE]">
                    {game.category}
                  </span>
                  <span className="text-xs px-2.5 py-1 bg-[#0A1628] border border-[#1A3355] rounded-full text-[#B0C4DE]">
                    {game.provider}
                  </span>
                </div>
                {game.jackpot && (
                  <div className="mt-2 text-xs font-bold text-[#FECC02]">
                    🏆 Jackpot: {game.jackpot}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <ApolloProvider client={client}>
      <HomePage />
    </ApolloProvider>
  );
}
