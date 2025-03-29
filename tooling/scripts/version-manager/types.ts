export interface Dependencies {
  [category: string]: {
    [packageName: string]: string;
  };
}

export interface UpdateGroup {
  packages: string[];
  relatedPackages?: string[];
  testPatterns?: string[];
}

export interface PackageCategory {
  name: string;
  patterns: string[];
  description: string;
}

export interface AutoCategorizeConfig {
  categories: PackageCategory[];
  defaultCategory: string;
}

export interface UpdateConfig {
  updateGroups: {
    [groupName: string]: UpdateGroup;
  };
  safetyChecks: {
    requiredTests: boolean;
    typeCheck: boolean;
    lint: boolean;
    backupBeforeUpdate: boolean;
  };
  categorize: AutoCategorizeConfig;
}

export interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

export interface VersionMismatch {
  workspace: string;
  package: string;
  expected: string;
  actual: string;
  isNewer?: boolean;
}

export interface UndefinedPackage {
  name: string;
  version: string;
  location: string;
}

export interface VersionCheckResult {
  mismatches: VersionMismatch[];
  hasNewerVersions: boolean;
  undefinedPackages: UndefinedPackage[];
}

export interface PackageVersion {
  version: string;
  releaseDate: Date;
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

export interface VersionPolicy {
  stability: {
    major: {
      freeze: boolean;
      minStabilityDays: number;
    };
    minor: {
      maxVersionJump: number;
      minStabilityDays: number;
    };
    patch: {
      autoUpdate: boolean;
      minStabilityDays: number;
    };
  };
}

export interface VersionSelectionOptions {
  currentVersion: string;
  policy?: VersionPolicy;
  dependencies: Record<string, string>;
  peerDependencies?: Record<string, string>;
}
