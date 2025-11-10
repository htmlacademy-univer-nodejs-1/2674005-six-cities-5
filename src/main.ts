#!/usr/bin/env node
import 'reflect-metadata';
import { config } from 'dotenv';
import { CLIApplication } from './cli/cli-application.js';
import { HelpCommand, VersionCommand, ImportCommand, GenerateCommand } from './cli/commands/index.js';
import { Application } from './app/application.js';
import { initContainer } from './app/container.js';
import { Component } from './shared/types/component.enum.js';
import { PinoLogger } from './shared/libs/logger/index.js';

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
  await app.init();
}

if (process.argv[2]) {
  bootstrapCLI();
} else {
  bootstrap().catch((err: unknown) => {
    console.error(err);
    throw err;
  });
}
