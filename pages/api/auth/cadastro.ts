import type { NextApiRequest, NextApiResponse } from 'next';

import { dbConnection } from '@/middlewares/db_connection';
import { cadastroReq } from '@/utils/types/cadastro.types';
import { userModel } from '@/models/user.model';

import validator from 'validator';
import bcrypt from 'bcrypt';

const endpointCadastro = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const usuario = req.body as cadastroReq;

    if (!usuario.nome || usuario.nome.length < 2) {
      return res.status(400).json({ erro: 'Nome inválido!' });
    }

    if (!validator.isEmail(usuario.email)) {
      return res.status(400).json({ erro: 'E-mail inválido!' });
    }
    const usuarioExistente = await userModel.findOne({ email: usuario.email });

    if (usuarioExistente) {
      return res.status(400).json({ erro: 'Este email já está em uso.' });
    }

    usuario.isAdmin = usuario.email.endsWith('admin.com');

    const senhaHash = await bcrypt.hash(usuario.senha, 10);

    const usuarioFormatado = {
      nome: usuario.nome,
      email: usuario.email,
      senha: senhaHash,
      isAdmin: usuario.isAdmin,
    };

    await userModel.create(usuarioFormatado);
    return res.status(200).json({ message: 'Usuário criado com sucesso!' });
  }
  return res.status(405).json({ error: 'Método informado inválido!' });
};

export default dbConnection(endpointCadastro);
