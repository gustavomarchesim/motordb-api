import { jwtValidator } from '@/middlewares/jwt_auth';
import type { NextApiRequest, NextApiResponse } from 'next';

const userEndpoint = (req: NextApiRequest, res: NextApiResponse) => {
  return res.status(200).json('Usuário autenticado com sucesso!');
};

export default jwtValidator(userEndpoint);
