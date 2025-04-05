import type { UndefinedPackage, UpdateConfig } from '../types';

export class CategorizeService {
  constructor(private updateConfig: UpdateConfig) {}

  categorizePackage(name: string): string {
    const { categories, defaultCategory } = this.updateConfig.categorize;

    for (const category of categories) {
      for (const pattern of category.patterns) {
        if (name.match(new RegExp(pattern))) {
          return category.name;
        }
      }
    }

    return defaultCategory;
  }

  categorizePackages(
    packages: UndefinedPackage[]
  ): Record<string, UndefinedPackage[]> {
    const categorizedPackages: Record<string, UndefinedPackage[]> = {};

    for (const pkg of packages) {
      const category = this.categorizePackage(pkg.name);
      if (!categorizedPackages[category]) {
        categorizedPackages[category] = [];
      }
      categorizedPackages[category].push(pkg);
    }

    return categorizedPackages;
  }

  getSortedCategories(
    categorizedPackages: Record<string, UndefinedPackage[]>
  ): [string, UndefinedPackage[]][] {
    return Object.entries(categorizedPackages)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([category, packages]) => [
        category,
        packages.sort((a, b) => a.name.localeCompare(b.name)),
      ]);
  }
}
