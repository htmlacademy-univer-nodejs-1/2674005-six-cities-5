import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { BaseController } from '../base-controller.js';
import { IUserService } from '../../shared/models/user/user-service.interface.js';
import { CreateUserDTO } from '../../shared/models/user/create-user.dto.js';
import { UpdateUserDTO } from '../../shared/models/user/update-user.dto.js';
import { Component } from '../../shared/types/component.enum.js';
import { Controller } from '../controller.interface.js';
import { HttpMethod } from '../http-method.enum.js';
import { ValidateObjectIdMiddleware } from '../middleware/validate-objectid.middleware.js';
import { ValidateDtoMiddleware } from '../middleware/validate-dto.middleware.js';

@injectable()
export class UserController extends BaseController implements Controller {
  constructor(
    @inject(Component.UserService) private userService: IUserService
  ) {
    super('/users');
    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateUserDTO)]
    });
    this.addRoute({
      path: '/:userId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [new ValidateObjectIdMiddleware('userId')]
    });
    this.addRoute({
      path: '/:userId',
      method: HttpMethod.Put,
      handler: this.update,
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
        new ValidateDtoMiddleware(UpdateUserDTO)
      ]
    });
  }

  async create(req: Request, res: Response): Promise<void> {
    const user = await this.userService.create(req.body);
    this.sendCreated(res, user);
  }

  async show(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    const user = await this.userService.findById(userId);

    if (!user) {
      this.sendNotFound(res, `User with id ${userId} not found`);
      return;
    }

    this.sendOk(res, user);
  }

  async update(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    const user = await this.userService.updateById(userId, req.body);

    if (!user) {
      this.sendNotFound(res, `User with id ${userId} not found`);
      return;
    }

    this.sendOk(res, user);
  }
}
