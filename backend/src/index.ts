import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { prisma } from './lib/prisma';

const app = express();
const PORT = process.env.PORT || 4000;

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: process.env.NODE_ENV !== 'production',
  });

  await server.start();

  // Configure CORS for production
  app.use(cors({
    origin: [
      'http://localhost:3000',
      'https://game-lobby-nine.vercel.app',
      'https://game-lobby-oz9ml0kq6-felix-cobbinahs-projects.vercel.app',
      'https://game-lobby-57gvcd0qi-felix-cobbinahs-projects.vercel.app'
    ],
    credentials: true,
  }));
  
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({ 
      status: 'healthy', 
      database: 'neon-postgresql',
      timestamp: new Date().toISOString()
    });
  });

  app.use('/graphql', expressMiddleware(server, {
    context: async ({ req }) => ({
      req,
      prisma,
    }),
  }));

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}/graphql`);
    console.log(`✅ Connected to Neon PostgreSQL`);
  });
}

startServer().catch((error) => {
  console.error('Error starting server:', error);
  process.exit(1);
});

process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});
