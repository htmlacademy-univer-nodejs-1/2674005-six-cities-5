import { Router, Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import asyncHandler from 'express-async-handler';
import { plainToInstance } from 'class-transformer';
import { BaseController } from '../base-controller.js';
import { IUserService } from '../../shared/models/user/user-service.interface.js';
import { CreateUserDTO } from '../../shared/models/user/create-user.dto.js';
import { UpdateUserDTO } from '../../shared/models/user/update-user.dto.js';
import { Component } from '../../shared/types/component.enum.js';
import { Controller } from '../controller.interface.js';

@injectable()
export class UserController extends BaseController implements Controller {
  public router: Router;

  constructor(
    @inject(Component.UserService) private userService: IUserService
  ) {
    super();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/register', asyncHandler((req: Request, res: Response) => this.create(req, res)));
    this.router.get('/:userId', asyncHandler((req: Request, res: Response) => this.show(req, res)));
    this.router.put('/:userId', asyncHandler((req: Request, res: Response) => this.update(req, res)));
  }

  private async create(req: Request, res: Response): Promise<void> {
    const dto = plainToInstance(CreateUserDTO, req.body);
    const user = await this.userService.create(dto);
    this.sendCreated(res, user);
  }

  private async show(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    const user = await this.userService.findById(userId);

    if (!user) {
      this.sendNotFound(res, `User with id ${userId} not found`);
      return;
    }

    this.sendOk(res, user);
  }

  private async update(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    const dto = plainToInstance(UpdateUserDTO, req.body);
    const user = await this.userService.updateById(userId, dto);

    if (!user) {
      this.sendNotFound(res, `User with id ${userId} not found`);
      return;
    }

    this.sendOk(res, user);
  }
}
