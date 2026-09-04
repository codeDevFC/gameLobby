'use client';

import { ApolloClient, InMemoryCache, HttpLink, ApolloProvider, useQuery, gql } from '@apollo/client';

// GraphQL Client
const client = new ApolloClient({
  link: new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql',
  }),
  cache: new InMemoryCache(),
});

// GraphQL Queries
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

const GET_FEATURED_GAMES = gql`
  query GetFeaturedGames($limit: Int) {
    featuredGames(limit: $limit) {
      id
      title
      category
      rating
      plays
      imageUrl
      provider
      isLive
    }
  }
`;

// Fallback games data for when backend is not available
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
    jackpot: '1,250,000kr'
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
    jackpot: '1,250,000kr'
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
    jackpot: '250,000kr'
  },
  {
    id: '4',
    title: 'Texas Hold\'em Poker',
    category: 'Table Games',
    rating: 4.6,
    plays: 6543,
    description: 'Professional poker experience with live dealers and real-time multiplayer.',
    imageUrl: '/images/games/poker-game.png',
    provider: 'Live Gaming Studios',
    isLive: true,
    features: ['Live Dealers', 'Multiplayer', 'Tournaments'],
    jackpot: '250,000kr'
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
    jackpot: '250,000kr'
  }
];

function HomePage() {
  // Try to fetch from GraphQL, fallback to local data if fails
  const { data: gamesData, error } = useQuery(GET_GAMES);
  const { data: featuredData } = useQuery(GET_FEATURED_GAMES, {
    variables: { limit: 6 },
  });

  // Use fallback data if GraphQL fails
  const games = gamesData?.games || fallbackGames;
  const featured = featuredData?.featuredGames || fallbackGames.slice(0, 4);
  const categories = games ? [...new Set(games.map((g: any) => g.category))] : ['Slots', 'Table Games'];

  return (
    <div className="min-h-screen bg-[#0A1628]">
      {/* Header */}
      <header className="bg-[#112240] border-b border-[#1A3355] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded overflow-hidden shadow-lg">
                <div className="h-full relative">
                  <div className="absolute inset-0 bg-[#005B99]"></div>
                  <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1/5 bg-[#FECC02]"></div>
                  <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-1/5 bg-[#FECC02]"></div>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Game<span className="text-[#FECC02]">Lobby</span>
                </h1>
                <p className="text-xs text-[#B0C4DE]">🇸🇪 Stockholm · Premium Gaming</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-[#B0C4DE] bg-[#0A1628] px-3 py-1 rounded-full border border-[#1A3355]">
                🎮 {games?.length || 0} Games
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Swedish Flag Divider */}
        <div className="w-full h-1 bg-gradient-to-r from-[#005B99] via-[#FECC02] to-[#005B99] rounded-full mb-8"></div>

        {/* Featured Games */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            ⭐ Featured Games
            <span className="text-xs text-[#B0C4DE] font-normal">🔥 Most Popular</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {featured.slice(0, 5).map((game: any) => (
              <div
                key={game.id}
                className="group relative rounded-lg overflow-hidden bg-[#112240] border border-[#1A3355] cursor-pointer transition-all duration-300 hover:scale-105 hover:border-[#FECC02] hover:shadow-xl hover:shadow-[#FECC02]/20"
              >
                <div className="aspect-video relative">
                  <img
                    src={game.imageUrl}
                    alt={game.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1614294149010-950b698f7180?w=400&h=300&fit=crop';
                    }}
                  />
                  {game.isLive && (
                    <span className="absolute top-2 left-2 bg-[#FECC02] text-[#0A1628] text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                      LIVE
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium text-white truncate group-hover:text-[#FECC02] transition-colors">
                    {game.title}
                  </h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-[#B0C4DE]">{game.category}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-[#FECC02] text-xs">★</span>
                      <span className="text-xs text-white">{game.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* All Games */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            🎮 All Games
            <span className="text-xs text-[#B0C4DE] font-normal">
              {games?.length || 0} games available
            </span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {games.map((game: any) => (
              <div
                key={game.id}
                className="group bg-[#112240] rounded-lg overflow-hidden border border-[#1A3355] transition-all duration-300 hover:scale-[1.02] hover:border-[#FECC02] hover:shadow-xl hover:shadow-[#FECC02]/10"
              >
                <div className="aspect-video relative bg-[#0A1628]">
                  <img
                    src={game.imageUrl}
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
                    <span className="text-[#FECC02] text-sm">★</span>
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
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-[#1A3355]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#B0C4DE]">🇸🇪</span>
              <span className="text-sm text-[#6B8AAB]">Made in Stockholm · Nordic Quality</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-[#6B8AAB]">
              <span>⚡ Fast</span>
              <span>🎮 Premium</span>
              <span>❄️ Nordic</span>
            </div>
          </div>
          <div className="text-center text-xs text-[#6B8AAB] mt-4">
            © 2026 GameLobby · 🇸🇪 Sweden
          </div>
        </footer>
      </main>
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
