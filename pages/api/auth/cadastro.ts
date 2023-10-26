import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import md5 from 'md5';
import validator from 'validator';

import { upload, uploadImagem } from '@/services/cosmicjs';

import { userModel } from '@/models/user.model';
import { cadastroReq } from '@/utils/types/cadastro.types';
import { dbConnection } from '@/middlewares/db_connection';

const handler = nc()
  .use(upload.single('file'))
  .post(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const usuario = req.body as cadastroReq;

      if (!usuario.nome || usuario.nome.length < 2) {
        return res.status(400).json({ erro: 'Nome inválido!' });
      }

      if (!validator.isEmail(usuario.email)) {
        return res.status(400).json({ erro: 'E-mail inválido!' });
      }

      if (
        !validator.isStrongPassword(usuario.senha, {
          minLength: 5,
          minUppercase: 1,
          minNumbers: 1,
        })
      ) {
        return res.status(400).json({
          erro: 'Senha inválida! A senha deve conter pelo menos 5 caracteres, 1 letra maiúscula e 1 número!',
        });
      }

      const usuarioExistente = await userModel.findOne({
        email: usuario.email,
      });

      if (usuarioExistente) {
        return res.status(400).json({ erro: 'Este email já está em uso.' });
      }

      usuario.isAdmin = usuario.email.endsWith('admin.com');

      const senhaHash = md5(usuario.senha);

      const image = await uploadImagem(req);

      const usuarioFormatado = {
        nome: usuario.nome,
        email: usuario.email,
        senha: senhaHash,
        avatar: image?.media.url,
        isAdmin: usuario.isAdmin,
      };

      await userModel.create(usuarioFormatado);
      return res.status(200).json({ mensagem: 'Usuário criado com sucesso!' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default dbConnection(handler);
