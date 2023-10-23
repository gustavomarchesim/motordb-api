import { dbConnection } from '@/middlewares/db_connection';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    res.status(200).json({ mensagem: 'Banco conectado com sucesso!' });
  } catch (error) {
    res
      .status(500)
      .json({ mensagem: 'Erro ao conectar ao banco de dados!', error });
  }
};

export default dbConnection(handler);
