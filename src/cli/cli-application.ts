import { Command } from './commands/command.interface.js';

type ParsedCommand = Record<string, string[]>;

export class CLIApplication {
  private commands: Map<string, Command> = new Map();
  private defaultCommand = '--help';

  registerCommands(commandList: Command[]): void {
    commandList.forEach((command) => {
      if (this.commands.has(command.getName())) {
        console.error(`Command ${command.getName()} is already registered`);
        return;
      }
      this.commands.set(command.getName(), command);
    });
  }

  getCommand(commandName: string): Command {
    return this.commands.get(commandName) ?? this.getDefaultCommand();
  }

  getDefaultCommand(): Command {
    if (!this.commands.has(this.defaultCommand)) {
      throw new Error(`The default command (${this.defaultCommand}) is not registered.`);
    }
    const command = this.commands.get(this.defaultCommand);
    if (!command) {
      throw new Error(`The default command (${this.defaultCommand}) is not registered.`);
    }
    return command;
  }

  processCommand(argv: string[]): ParsedCommand {
    const parsedCommand: ParsedCommand = {};
    let currentCommandName = '';

    for (const argument of argv) {
      if (argument.startsWith('--')) {
        parsedCommand[argument] = [];
        currentCommandName = argument;
      } else if (currentCommandName && argument) {
        parsedCommand[currentCommandName].push(argument);
      }
    }

    return parsedCommand;
  }

  async executeCommand(argv: string[]): Promise<void> {
    const parsedCommand = this.processCommand(argv);
    const [commandName] = Object.keys(parsedCommand);
    const command = this.getCommand(commandName);
    const commandArguments = parsedCommand[commandName] ?? [];
    await command.execute(...commandArguments);
  }
}
