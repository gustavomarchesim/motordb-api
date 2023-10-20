import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import mongoose from 'mongoose';

export const dbConnection =
  (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (mongoose.connections[0].readyState) {
      return handler(req, res);
    }

    const { DB_CONNECTION_STRING } = process.env;

    if (!DB_CONNECTION_STRING) {
      return res.status(500).json({
        Error:
          'Não encontrada string de conexão, entrar em contato com um administrador!',
      });
    }

    mongoose.connection.on('connected', () =>
      console.info('Banco de dados conectado com sucesso!')
    );

    mongoose.connection.on('disconnected', () => {
      console.warn('Banco de dados desconectado.');
    });

    mongoose.connection.on('error', () =>
      console.error('Erro ao conectar ao banco de dados!')
    );

    await mongoose.connect(DB_CONNECTION_STRING);
    return handler(req, res);
  };
