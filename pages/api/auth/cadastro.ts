import type { NextApiRequest, NextApiResponse } from 'next';
import { dbConnection } from '@/middlewares/db_connection';
import { cadastroReq } from '@/utils/types/cadastro.types';
import { userModel } from '@/models/user.model';
import validator from 'validator';
import md5 from 'md5';

const endpointCadastro = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'POST') {
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

      const usuarioFormatado = {
        nome: usuario.nome,
        email: usuario.email,
        senha: senhaHash,
        isAdmin: usuario.isAdmin,
      };

      await userModel.create(usuarioFormatado);
      return res.status(200).json({ mensagem: 'Usuário criado com sucesso!' });
    } else {
      return res.status(405).json({ error: 'Método informado inválido!' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export default dbConnection(endpointCadastro);
