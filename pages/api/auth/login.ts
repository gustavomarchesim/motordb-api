import type { NextApiRequest, NextApiResponse } from 'next';
import { dbConnection } from '@/middlewares/db_connection';
import { loginReq } from '@/utils/types/login.types';
import { userModel } from '@/models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET;

const endpointLogin = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const usuario = req.body as loginReq;
    const usuarioLogin = await userModel.findOne({ email: usuario.email });

    if (usuarioLogin) {
      const senhaCorrespondente = await bcrypt.compare(
        usuario.senha,
        usuarioLogin.senha
      );

      if (senhaCorrespondente && secretKey) {
        const token = jwt.sign({ _id: usuarioLogin._id }, secretKey);
        return res.status(200).json({ token });
      }
    }

    return res.status(400).json({ message: 'Usuário não encontrado!' });
  }

  return res.status(400).json({ message: 'Método inválido!' });
};

export default dbConnection(endpointLogin);
