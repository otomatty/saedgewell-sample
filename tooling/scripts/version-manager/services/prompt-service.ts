import readline from 'node:readline';
import type { UndefinedPackage } from '../types';

export class PromptService {
  async promptForPackageAddition(
    sortedCategories: [string, UndefinedPackage[]][]
  ): Promise<boolean> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    this.displayPackages(sortedCategories);

    const answer = await this.question(
      rl,
      '\nDo you want to add these packages to the configuration? (y/N): '
    );
    rl.close();

    return answer.toLowerCase() === 'y';
  }

  private displayPackages(
    sortedCategories: [string, UndefinedPackage[]][]
  ): void {
    console.log('\nProposed categorization:');

    for (const [category, packages] of sortedCategories) {
      console.log(`\n${category}:`);
      for (const pkg of packages) {
        const locations = pkg.location.includes(', ')
          ? `\n    Found in: ${pkg.location}`
          : ` (in ${pkg.location})`;
        console.log(`  - ${pkg.name}@${pkg.version}${locations}`);
      }
    }
  }

  private question(rl: readline.Interface, query: string): Promise<string> {
    return new Promise((resolve) => {
      rl.question(query, resolve);
    });
  }

  async confirm(message: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const stdin = process.stdin;
      const stdout = process.stdout;

      stdout.write(`${message} (y/N): `);
      stdin.resume();
      stdin.setEncoding('utf8');

      stdin.once('data', (data) => {
        stdin.pause();
        const response = data.toString().trim().toLowerCase();
        resolve(response === 'y' || response === 'yes');
      });
    });
  }
}
