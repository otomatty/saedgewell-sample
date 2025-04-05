import fs from 'node:fs/promises';
import path from 'node:path';
import { execSync } from 'node:child_process';

export class FileService {
  constructor(private readonly workspaceRoot: string) {}

  async readJson<T>(relativePath: string): Promise<T> {
    const filePath = path.join(this.workspaceRoot, relativePath);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as T;
  }

  async writeJson(relativePath: string, data: unknown): Promise<void> {
    const filePath = path.join(this.workspaceRoot, relativePath);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  }

  async getWorkspaces(): Promise<string[]> {
    const rootPkg = await this.readJson<{ workspaces: string[] }>(
      'package.json'
    );
    const workspacePatterns = rootPkg.workspaces;

    const workspaces = [];
    for (const pattern of workspacePatterns) {
      const matches = execSync(
        `find . -type f -path "./${pattern}/package.json" -not -path "*/node_modules/*" -exec dirname {} \\;`,
        { cwd: this.workspaceRoot }
      )
        .toString()
        .trim()
        .split('\n')
        .filter(Boolean);

      workspaces.push(...matches);
    }

    return workspaces.map((w) => w.slice(2));
  }

  async createBackup(dependencies: unknown): Promise<void> {
    const backupDir = path.join(this.workspaceRoot, '.version-manager-backup');
    await fs.mkdir(backupDir, { recursive: true });

    await fs.writeFile(
      path.join(backupDir, 'dependencies.json'),
      JSON.stringify(dependencies, null, 2)
    );

    const workspaces = await this.getWorkspaces();
    for (const workspace of workspaces) {
      const pkgPath = path.join(workspace, 'package.json');
      const backupPath = path.join(
        backupDir,
        `${workspace.replace(/\//g, '_')}_package.json`
      );
      await fs.copyFile(pkgPath, backupPath);
    }
  }

  async rollback(): Promise<void> {
    const backupDir = path.join(this.workspaceRoot, '.version-manager-backup');

    const backupDependencies = await this.readJson(
      path.join(backupDir, 'dependencies.json')
    );
    await this.writeJson(
      'tooling/configs/dependencies.json',
      backupDependencies
    );

    const workspaces = await this.getWorkspaces();
    for (const workspace of workspaces) {
      const pkgPath = path.join(workspace, 'package.json');
      const backupPath = path.join(
        backupDir,
        `${workspace.replace(/\//g, '_')}_package.json`
      );
      await fs.copyFile(backupPath, pkgPath);
    }

    await fs.rm(backupDir, { recursive: true });
  }
}
