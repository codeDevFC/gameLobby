'use client';

import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql, HttpLink } from '@apollo/client';
import { useState, useEffect } from 'react';

// Create Apollo Client with proper URL
const getClient = () => {
  const uri = process.env.NEXT_PUBLIC_GRAPHQL_URL || 
              'https://game-lobby-57gvcd0qi-felix-cobbinahs-projects.vercel.app/graphql';
  
  return new ApolloClient({
    link: new HttpLink({
      uri: uri,
    }),
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

function GameCard({ game }) {
  return (
    <div className="group bg-[#112240] rounded-lg overflow-hidden border border-[#1A3355] hover:border-[#FECC02] transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#FECC02]/10">
      <div className="aspect-video relative bg-[#0A1628]">
        <img
          src={game.imageUrl || 'https://images.unsplash.com/photo-1614294149010-950b698f7180?w=400&h=300&fit=crop'}
          alt={game.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1614294149010-950b698f7180?w=400&h=300&fit=crop';
          }}
        />
        {game.isLive && (
          <span className="absolute top-3 left-3 bg-[#FECC02] text-[#0A1628] text-xs font-bold px-2.5 py-1 rounded-full animate-pulse flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[#0A1628] rounded-full"></span>
            LIVE
          </span>
        )}
        <div className="absolute bottom-3 right-3 bg-[#0A1628]/80 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 border border-[#1A3355]">
          <span className="text-[#FECC02]">⭐</span>
          <span className="text-white text-sm font-semibold">{game.rating}</span>
        </div>
        <div className="absolute bottom-3 left-3 bg-[#0A1628]/80 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 border border-[#1A3355]">
          <span className="text-[#B0C4DE] text-xs">👾</span>
          <span className="text-white text-xs">{game.plays.toLocaleString()}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-white font-semibold text-base truncate group-hover:text-[#FECC02] transition-colors">
          {game.title}
        </h3>
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
  );
}

function HomePage() {
  const { data, loading, error } = useQuery(GET_GAMES);
  
  console.log('GraphQL Data:', data);
  console.log('Loading:', loading);
  console.log('Error:', error);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A1628] flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Loading games...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A1628] flex items-center justify-center p-8">
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-6 rounded-lg max-w-md text-center">
          <h2 className="text-xl font-bold mb-2">⚠️ Connection Error</h2>
          <p className="text-sm">{error.message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-[#FECC02] text-[#0A1628] px-4 py-2 rounded-lg font-bold hover:bg-[#FECC02]/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const games = data?.games || [];

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
            <GameCard key={game.id} game={game} />
          ))}
        </div>

        <footer className="mt-12 pt-8 border-t border-[#1A3355] text-center text-[#6B8AAB] text-sm">
          <p>© 2026 GameLobby · 🇸🇪 Sweden · Made with ❤️</p>
        </footer>
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
