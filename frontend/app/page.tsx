'use client';

import { ApolloClient, InMemoryCache, HttpLink, ApolloProvider, useQuery, gql } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:4000/graphql',
  }),
  cache: new InMemoryCache(),
});

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

  return (
    <div className="min-h-screen bg-[#0A1628] px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">
        Game<span className="text-[#FECC02]">Lobby</span>
      </h1>
      
      {featuredData?.featuredGames && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-4">⭐ Featured</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {featuredData.featuredGames.map((game: any) => (
              <div key={game.id} className="bg-[#112240] rounded-lg overflow-hidden border border-[#1A3355]">
                <img src={game.imageUrl} alt={game.title} className="w-full aspect-video object-cover" />
                <div className="p-3">
                  <h3 className="text-white text-sm font-medium truncate">{game.title}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-[#B0C4DE]">{game.category}</span>
                    <span className="text-xs text-[#FECC02]">★ {game.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {gamesData?.games && (
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">🎮 All Games</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {gamesData.games.map((game: any) => (
              <div key={game.id} className="bg-[#112240] rounded-lg overflow-hidden border border-[#1A3355] hover:border-[#FECC02] transition-all">
                <img src={game.imageUrl} alt={game.title} className="w-full aspect-video object-cover" />
                <div className="p-4">
                  <h3 className="text-white font-semibold">{game.title}</h3>
                  <p className="text-[#B0C4DE] text-sm mt-1 line-clamp-2">{game.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-[#0A1628] px-2 py-1 rounded-full text-[#B0C4DE]">{game.category}</span>
                    <span className="text-xs bg-[#0A1628] px-2 py-1 rounded-full text-[#B0C4DE]">{game.provider}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
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
