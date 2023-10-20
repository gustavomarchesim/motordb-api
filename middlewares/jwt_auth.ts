import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import jwt, { JwtPayload } from 'jsonwebtoken';
import type { responseTypes } from '@/utils/types/response.types';

export const jwtValidator =
  (handler: NextApiHandler) =>
  (req: NextApiRequest, res: NextApiResponse<responseTypes>) => {
    try {
      const { JWT_SECRET } = process.env;
      if (!JWT_SECRET) {
        return res.status(500).json({ mensagem: 'Token JWT não informado! ' });
      }

      if (!req || !req.headers) {
        return res.status(401).json({
          mensagem:
            ' Você não está autorizado! Entre em contato com um Administrador! ',
        });
      }

      if (req.method !== 'OPTIONS') {
        const authorization = req.headers['authorization'];
        if (!authorization) {
          return res.status(401).json({
            mensagem:
              ' Você não está autorizado! Entre em contato com um Administrador! ',
          });
        }

        const token = authorization.substring(7);
        if (!token) {
          return res.status(401).json({
            mensagem:
              ' Você não está autorizado! Entre em contato com um Administrador! ',
          });
        }

        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        if (!decoded) {
          return res.status(401).json({
            mensagem:
              ' Você não está autorizado! Entre em contato com um Administrador! ',
          });
        }

        if (!req.query) {
          req.query = {};
        }

        req.query.userId = decoded._id;
      }
      return handler(req, res);
    } catch (erro) {
      return res.status(500).json({ erro: 'Erro interno de Servidor' });
    }
  };
