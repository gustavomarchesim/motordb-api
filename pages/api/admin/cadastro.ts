import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { carModel } from '@/models/car.model';
import { dbConnection } from '@/middlewares/db_connection';
import { jwtValidator } from '@/middlewares/jwt_auth';
import { upload, uploadImagem } from '@/services/cosmicjs';

const handler = nc()
  .use(upload.single('file'))
  .post(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      if (!req.body) {
        return res
          .status(400)
          .json({ erro: 'Nenhum dado inserido na requisição!' });
      }

      const reqData = req.body;

      if (!reqData.marca || !reqData.modelo || !reqData.valor) {
        return res.status(400).json({ erro: 'Dados inválidos!' });
      }

      const existingCar = await carModel.findOne({ marca: reqData.marca });

      const image = await uploadImagem(req);

      if (existingCar) {
        existingCar.modelos.push({
          modelo: reqData.modelo,
          imagemModelo: image?.media?.url,
          valor: reqData.valor,
          detalhes: reqData.detalhes,
        });

        await existingCar.save();
      } else {
        const newCar = {
          marca: reqData.marca,
          imagemMarca: image?.media?.url,
          modelos: [
            {
              modelo: reqData.modelo,
              imagemModelo: image?.media?.url,
              valor: reqData.valor,
              detalhes: reqData.detalhes,
            },
          ],
        };
        await carModel.create(newCar);
      }

      return res
        .status(200)
        .json({ mensagem: 'Veículo registrado com sucesso!' });
    } catch (error) {
      return res
        .status(500)
        .json({ error: 'Erro interno do servidor!', e: error });
    }
  });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default jwtValidator(dbConnection(handler));
