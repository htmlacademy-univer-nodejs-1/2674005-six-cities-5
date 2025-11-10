#!/usr/bin/env node
import { CLIApplication } from './cli/cli-application.js';
import { HelpCommand, VersionCommand, ImportCommand, GenerateCommand } from './cli/commands/index.js';

function bootstrap() {
  const cliApplication = new CLIApplication();
  cliApplication.registerCommands([
    new HelpCommand(),
    new VersionCommand(),
    new ImportCommand(),
    new GenerateCommand(),
  ]);

  cliApplication.executeCommand(process.argv.slice(2));
}

bootstrap();
