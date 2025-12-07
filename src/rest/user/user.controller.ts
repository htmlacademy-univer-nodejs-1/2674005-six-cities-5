import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { BaseController } from '../base-controller.js';
import { IUserService } from '../../shared/models/user/user-service.interface.js';
import { CreateUserDTO } from '../../shared/models/user/create-user.dto.js';
import { UpdateUserDTO } from '../../shared/models/user/update-user.dto.js';
import { LoginUserDTO } from '../../shared/models/user/login-user.dto.js';
import { Component } from '../../shared/types/component.enum.js';
import { Controller } from '../controller.interface.js';
import { HttpMethod } from '../http-method.enum.js';
import { ValidateObjectIdMiddleware } from '../middleware/validate-objectid.middleware.js';
import { ValidateDtoMiddleware } from '../middleware/validate-dto.middleware.js';
import { DocumentExistsMiddleware } from '../middleware/document-exists.middleware.js';
import { UploadFileMiddleware } from '../middleware/upload-file.middleware.js';
import { PrivateRouteMiddleware } from '../middleware/private-route.middleware.js';
import { Config } from '../../shared/libs/config/config.js';
import { AuthService } from '../../shared/libs/auth/auth-service.interface.js';

@injectable()
export class UserController extends BaseController implements Controller {
  constructor(
    @inject(Component.UserService) private userService: IUserService,
    @inject(Component.Config) private config: Config,
    @inject(Component.AuthService) private authService: AuthService
  ) {
    super('/users');
    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateUserDTO)]
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(LoginUserDTO)]
    });
    this.addRoute({
      path: '/check',
      method: HttpMethod.Get,
      handler: this.checkAuth,
      middlewares: [new PrivateRouteMiddleware(this.authService)]
    });
    this.addRoute({
      path: '/:userId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
        new DocumentExistsMiddleware(this.userService, 'User', 'userId')
      ]
    });
    this.addRoute({
      path: '/:userId',
      method: HttpMethod.Put,
      handler: this.update,
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
        new ValidateDtoMiddleware(UpdateUserDTO),
        new DocumentExistsMiddleware(this.userService, 'User', 'userId')
      ]
    });
    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
        new UploadFileMiddleware(this.config.uploadDirectory, 'avatar'),
        new DocumentExistsMiddleware(this.userService, 'User', 'userId')
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
    this.sendOk(res, user!);
  }

  async update(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    const user = await this.userService.updateById(userId, req.body);
    this.sendOk(res, user!);
  }

  async uploadAvatar(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    const uploadFile = req.file;

    if (!uploadFile) {
      this.sendBadRequest(res, 'Avatar file is required');
      return;
    }

    const avatarUrl = `/upload/${uploadFile.filename}`;
    const updatedUser = await this.userService.updateById(userId, { avatarUrl });
    this.sendOk(res, updatedUser!);
  }

  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    const token = await this.authService.authenticate(email, password);

    if (!token) {
      this.sendUnauthorized(res, 'Invalid email or password');
      return;
    }

    const user = await this.userService.findByEmail(email);
    this.sendOk(res, { token, email: user!.email, name: user!.name });
  }

  async checkAuth(req: Request, res: Response): Promise<void> {
    const { tokenPayload } = req;

    if (!tokenPayload) {
      this.sendUnauthorized(res, 'Unauthorized');
      return;
    }

    const user = await this.userService.findByEmail(tokenPayload.email);

    if (!user) {
      this.sendUnauthorized(res, 'Unauthorized');
      return;
    }

    this.sendOk(res, { email: user.email, name: user.name, avatarUrl: user.avatarUrl, type: user.type });
  }
}
