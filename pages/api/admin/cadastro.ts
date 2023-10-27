import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { carModel } from '@/models/car.model';
import { dbConnection } from '@/middlewares/db_connection';
import { jwtValidator } from '@/middlewares/jwt_auth';

const handler = nc().post(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { reqData } = req.body;

    if (!reqData.marca || !reqData.modelo || !reqData.valor) {
      return res.status(400).json({ erro: 'Dados inválidos!' });
    }

    const newCar = {
      marca: reqData.marca,
      nome: reqData.modelo,
      valor: reqData.valor,
    };

    await carModel.create(newCar);

    return res
      .status(200)
      .json({ mensagem: 'Veículo registrado com sucesso!' });
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
