import { Command } from './command.interface.js';
import { TSVOfferGenerator } from '../../shared/libs/offer-generator/index.js';
import { MockServerData } from '../../shared/types/index.js';
import got from 'got';
import { createWriteStream } from 'node:fs';
import chalk from 'chalk';

export class GenerateCommand implements Command {
  getName(): string {
    return '--generate';
  }

  async execute(...parameters: string[]): Promise<void> {
    const [count, filepath, url] = parameters;

    if (!count || !filepath || !url) {
      console.log(chalk.red('\nНеобходимо указать все параметры'));
      console.log(chalk.yellow('Использование: --generate <count> <filepath> <url>'));
      console.log(chalk.gray('Пример: --generate 100 ./mocks/test-data.tsv http://localhost:3000'));
      return;
    }

    const offerCount = Number.parseInt(count, 10);

    if (Number.isNaN(offerCount) || offerCount <= 0) {
      console.log(chalk.red('Количество должно быть положительным числом'));
      return;
    }

    try {
      console.log(chalk.blue(`\nЗагрузка данных с ${url}...`));
      const response = await got.get(url);
      const mockData = JSON.parse(response.body) as MockServerData;

      console.log(chalk.green('✓ Данные успешно загружены'));
      console.log(chalk.blue(`Генерация ${offerCount} предложений...`));

      const offerGenerator = new TSVOfferGenerator(mockData);
      const writeStream = createWriteStream(filepath, { encoding: 'utf-8' });

      for (let i = 0; i < offerCount; i++) {
        const tsvRow = offerGenerator.generate();
        writeStream.write(`${tsvRow}\n`);

        if ((i + 1) % 1000 === 0) {
          console.log(chalk.gray(`  Сгенерировано ${i + 1} из ${offerCount}...`));
        }
      }

      writeStream.end();

      await new Promise<void>((resolve, reject) => {
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
      });

      console.log(chalk.green(`\n✓ Файл ${filepath} успешно создан с ${offerCount} предложениями`));

    } catch (error) {
      console.error(chalk.red('\n✗ Ошибка при генерации данных'));
      if (error instanceof Error) {
        console.error(chalk.red(error.message));
        console.error(chalk.gray(error.stack));
      }
    }
  }
}
