import type { NextApiResponse } from 'next';
import nc from 'next-connect';
import validator from 'validator';

import { upload, uploadImagem } from '@/services/cosmicjs';
import { dbConnection } from '@/middlewares/db_connection';
import { jwtValidator } from '@/middlewares/jwt_auth';

const handler = nc()
  .use(upload.single('file'))
  .post(async (req: any, res: NextApiResponse) => {
    try {
      const { marca, modelo, valor, file } = req?.body;
      if (!marca) {
        return res.status(400).json({ mensagem: 'Marca não inserida!' });
      }

      if (!modelo) {
        return res.status(400).json({ mensagem: 'Modelo não inserido!' });
      }

      const regex = /^[1-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/;
      if (!regex.test(valor)) {
        return res.status(400).json({ mensagem: 'Valor inválido!' });
      }

      if (!req.file) {
        return res
          .status(400)
          .json({ mensagem: 'Arquivo de imagem não encontrado' });
      }
      return res.status(200).json({ mensagem: 'Publicação válida!' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno do servidor!' });
    }
  });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default jwtValidator(dbConnection(handler));
