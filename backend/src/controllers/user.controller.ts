import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { createUserSchema } from "../validators/user.validators";

export class UserController {
  // GET /users?page=1&limit=10
  static async list(req: Request, res: Response) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await UserService.list(page, limit);
    return res.json(result);
  }

  // POST /users
  static async create(req: Request, res: Response) {
    const data = createUserSchema.parse(req.body);
    const user = await UserService.create(data);
    return res.status(201).json(user);
  }
}
