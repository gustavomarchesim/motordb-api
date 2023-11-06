import type { NextApiRequest, NextApiResponse } from 'next';

import { dbConnection } from '@/middlewares/db_connection';
import { jwtValidator } from '@/middlewares/jwt_auth';
import { userModel } from '@/models/user.model';

import md5 from 'md5';
import jwt from 'jsonwebtoken';

import type { responseTypes } from '@/utils/types/response.types';
import type { loginTypes } from '@/utils/types/login.types';

const endpointLogin = async (
  req: NextApiRequest,
  res: NextApiResponse<loginTypes | responseTypes>
) => {
  try {
    const { JWT_SECRET } = process.env;
    if (!JWT_SECRET) {
      return res.status(500).json({ mensagem: 'Token JWT não informado! ' });
    }

    if (req.method === 'POST') {
      const { login, senha } = req.body;
      const usuariosEncontrados = await userModel.find({
        email: login,
        senha: md5(senha),
      });

      if (usuariosEncontrados && usuariosEncontrados.length > 0) {
        const usuarioEncontrado = usuariosEncontrados[0];
        const token = jwt.sign(
          { _id: usuarioEncontrado._id, isAdmin: usuarioEncontrado.isAdmin },
          JWT_SECRET
        );

        return res.status(200).json({
          nome: usuarioEncontrado.nome,
          email: usuarioEncontrado.email,
          isAdmin: usuarioEncontrado.isAdmin,
          token,
        });
      }

      return res.status(401).json({ mensagem: 'Usuário não encontrado!' });
    } else {
      return res.status(405).json({ mensagem: 'Método inválido!' });
    }
  } catch (erro) {
    return res.status(500).json({ mensagem: 'Erro interno do servidor' });
  }
};
export default dbConnection(endpointLogin);
