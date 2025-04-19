import { execSync } from 'node:child_process';
import type { UpdateConfig } from '../types';

export class SafetyService {
  constructor(private readonly config: UpdateConfig) {}

  async runSafetyChecks(): Promise<boolean> {
    const { safetyChecks } = this.config;

    try {
      if (safetyChecks.typeCheck) {
        execSync('bun run typecheck', { stdio: 'inherit' });
      }

      if (safetyChecks.lint) {
        execSync('bun run lint', { stdio: 'inherit' });
      }

      if (safetyChecks.requiredTests) {
        execSync('bun run test', { stdio: 'inherit' });
      }

      return true;
    } catch (error) {
      return false;
    }
  }
}
