import { Request, Response } from 'express';
import { UnitOfWork } from '../unit-of-work';

export class UserController {
  private unitOfWork: UnitOfWork;

  constructor(unitOfWork: UnitOfWork) {
    this.unitOfWork = unitOfWork;
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await this.unitOfWork.userRepository.getAll();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users' });
    }
  }
}
