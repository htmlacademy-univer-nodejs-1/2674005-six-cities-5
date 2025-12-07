#!/usr/bin/env node
import 'reflect-metadata';
import { config } from 'dotenv';
import { CLIApplication } from './cli/cli-application.js';
import { HelpCommand, VersionCommand, ImportCommand, GenerateCommand } from './cli/commands/index.js';
import { Application } from './app/application.js';
import { initContainer } from './app/container.js';
import { Component } from './shared/types/component.enum.js';
import { PinoLogger } from './shared/libs/logger/index.js';
import { UserController } from './rest/user/user.controller.js';
import { OfferController } from './rest/offer/offer.controller.js';
import { CommentController } from './rest/comment/comment.controller.js';

config();

function bootstrapCLI() {
  const cliApplication = new CLIApplication();
  cliApplication.registerCommands([
    new HelpCommand(),
    new VersionCommand(),
    new ImportCommand(),
    new GenerateCommand(),
  ]);

  cliApplication.executeCommand(process.argv.slice(2));
}

async function bootstrap() {
  const container = initContainer();

  const app = container.get<Application>(Application);
  const logger = container.get<PinoLogger>(Component.Logger);

  logger.info('Server starting...');

  const controllers = [
    container.get<UserController>(UserController),
    container.get<OfferController>(OfferController),
    container.get<CommentController>(CommentController),
  ];

  await app.init(controllers);
}

if (process.argv[2]) {
  bootstrapCLI();
} else {
  bootstrap().catch((err: unknown) => {
    console.error(err);
    throw err;
  });
}
