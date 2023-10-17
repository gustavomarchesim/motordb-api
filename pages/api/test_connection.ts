import { dbConnection } from '@/middlewares/db_connection';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  res
    .status(200)
    .json({ message: 'Conexão com o MongoDB testada com sucesso!' });
};

export default dbConnection(handler);
