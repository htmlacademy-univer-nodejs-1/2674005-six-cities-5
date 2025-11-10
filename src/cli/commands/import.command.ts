import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { Offer } from '../../shared/types/index.js';
import chalk from 'chalk';

export class ImportCommand implements Command {
  getName(): string {
    return '--import';
  }

  async execute(...parameters: string[]): Promise<void> {
    const [filename] = parameters;

    if (!filename) {
      console.log(chalk.red('Необходимо указать путь к TSV файлу'));
      console.log(chalk.yellow('Пример: --import ./mocks/offers.tsv'));
      return;
    }

    try {
      const fileReader = new TSVFileReader(filename);
      const offers: Offer[] = [];

      console.log(chalk.blue(`\nИмпорт данных из файла: ${filename}\n`));

      fileReader.on('line', (offer: Offer) => {
        offers.push(offer);
      });

      fileReader.on('end', (count: number) => {
        console.log(chalk.green(`\n✓ Успешно импортировано ${count} предложений:\n`));

        offers.slice(0, 10).forEach((offer, index) => {
          console.log(chalk.cyan(`${index + 1}. ${offer.title}`));
          console.log(chalk.gray(`   Описание: ${offer.description.substring(0, 50)}...`));
          console.log(chalk.gray(`   Город: ${offer.city}`));
          console.log(chalk.gray(`   Тип: ${offer.type}`));
          console.log(chalk.gray(`   Цена: €${offer.price} в сутки`));
          console.log(chalk.gray(`   Рейтинг: ${offer.rating} ⭐`));
          console.log(chalk.gray(`   Комнат: ${offer.rooms}, Гостей: ${offer.guests}`));
          console.log(chalk.gray(`   Автор: ${offer.author.name} ${offer.author.lastName} (${offer.author.email})`));
          console.log(chalk.gray(`   Комментариев: ${offer.commentsCount}`));
          console.log(chalk.gray(`   Премиум: ${offer.isPremium ? 'Да' : 'Нет'}`));
          console.log(chalk.gray(`   Удобства: ${offer.amenities.join(', ')}`));
          console.log();
        });

        if (offers.length > 10) {
          console.log(chalk.gray(`... и еще ${offers.length - 10} предложений\n`));
        }
      });

      fileReader.on('error', (error: Error) => {
        console.error(chalk.red(`\n✗ Ошибка при импорте данных из файла ${filename}`));
        console.error(chalk.red(error.message));
      });

      await fileReader.read();

    } catch (error) {
      console.error(chalk.red(`\n✗ Ошибка при импорте данных из файла ${filename}`));
      if (error instanceof Error) {
        console.error(chalk.red(error.message));
      }
    }
  }
}
