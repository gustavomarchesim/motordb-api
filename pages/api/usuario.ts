import { jwtValidator } from '@/middlewares/jwt_auth';
import type { NextApiRequest, NextApiResponse } from 'next';

const userEndpoint = (req: NextApiRequest, res: NextApiResponse) => {
  try {
    return res.status(200).json('Usuário autenticado com sucesso!');
  } catch (error) {
    return res
      .status(401)
      .json({ mensagem: 'Erro durante a autenticação', error });
  }
};

export default jwtValidator(userEndpoint);
