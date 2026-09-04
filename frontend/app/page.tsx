'use client';

import { ApolloClient, InMemoryCache, HttpLink, ApolloProvider, useQuery, gql } from '@apollo/client';

// GraphQL Client
const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:4000/graphql',
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

function HomePage() {
  const { data: gamesData } = useQuery(GET_GAMES);
  const { data: featuredData } = useQuery(GET_FEATURED_GAMES, {
    variables: { limit: 6 },
  });

  const categories = gamesData?.games
    ? [...new Set(gamesData.games.map((g: any) => g.category))]
    : [];

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
                🎮 {gamesData?.games?.length || 0} Games
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {featuredData?.featuredGames?.slice(0, 6).map((game: any) => (
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

        {/* Category Filter */}
        <section className="mb-8">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-[#B0C4DE] mr-2">Categories:</span>
            <button className="px-3 py-1 rounded-full text-xs font-medium bg-[#FECC02] text-[#0A1628]">
              All
            </button>
            {categories.map((category: string) => (
              <button
                key={category}
                className="px-3 py-1 rounded-full text-xs font-medium bg-[#112240] text-[#B0C4DE] border border-[#1A3355] hover:border-[#FECC02] transition-colors"
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* All Games */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            🎮 All Games
            <span className="text-xs text-[#B0C4DE] font-normal">
              {gamesData?.games?.length || 0} games available
            </span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {gamesData?.games?.map((game: any) => (
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
                  {game.features && game.features.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {game.features.slice(0, 3).map((feature: string, index: number) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-0.5 bg-[#FECC02]/10 border border-[#FECC02]/20 rounded-full text-[#FECC02]"
                        >
                          {feature}
                        </span>
                      ))}
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
            © 2026 GameLobby · Elohim Beauty Salon · 🇸🇪 Sweden
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
