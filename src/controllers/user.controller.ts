import { Request, Response } from 'express';

export const getMe = async (req: Request, res: Response) => {
  // o middleware já validou o token
  // e injetou o usuário no request
  return res.json(req.user);
};
