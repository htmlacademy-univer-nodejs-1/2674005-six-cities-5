import { Command } from './command.interface.js';
import chalk from 'chalk';

export class HelpCommand implements Command {
  getName(): string {
    return '--help';
  }

  execute(): void {
    console.log(chalk.bold.cyan('\nПрограмма для подготовки данных для REST API сервера.\n'));
    console.log(chalk.yellow('Пример:'));
    console.log(chalk.gray('    cli.js --<command> [--arguments]'));
    console.log(chalk.yellow('\nКоманды:'));
    console.log(`${chalk.green('    --version:')}                   ${chalk.white('# выводит номер версии')}`);
    console.log(`${chalk.green('    --help:')}                      ${chalk.white('# печатает этот текст')}`);
    console.log(`${chalk.green('    --import <path>:')}             ${chalk.white('# импортирует данные из TSV')}`);
    console.log(`${chalk.green('    --generate <n> <path> <url>:')} ${chalk.white('# генерирует тестовые данные')}`);
    console.log();
  }
}
