import path from 'node:path';
import type { PathAlias } from '../../types/mdx';

/**
 * パス解決ロジック
 * 相対パスとエイリアスの解決を行う
 */
export class PathResolver {
  constructor(private basePath: string) {}

  /**
   * パスを解決する
   * @param targetPath 解決するパス
   * @returns 解決されたパス
   */
  resolvePath(targetPath: string): string {
    // 絶対パスの場合
    if (targetPath.startsWith('/')) {
      return targetPath;
    }

    // それ以外は現在のパスからの相対パスとして扱う
    return path.normalize(`/${targetPath}`);
  }

  /**
   * 相対パスを解決する
   * @param sourcePath 元のパス
   * @param targetPath 解決するパス
   */
  resolveRelativePath(sourcePath: string, targetPath: string): string {
    // 相対パスの解決
    if (targetPath.startsWith('./') || targetPath.startsWith('../')) {
      const sourceDir = path.dirname(sourcePath);
      return path.normalize(path.join(sourceDir, targetPath));
    }

    // 絶対パスの場合
    if (targetPath.startsWith('/')) {
      return path.normalize(path.join(this.basePath, targetPath));
    }

    // それ以外は現在のパスからの相対パスとして扱う
    return path.normalize(path.join(this.basePath, targetPath));
  }

  /**
   * 2つのパス間の相対パスを取得
   * @param fromPath 元のパス
   * @param toPath 目標のパス
   */
  getRelativePath(fromPath: string, toPath: string): string {
    return path.relative(path.dirname(fromPath), toPath);
  }

  /**
   * パスからスラグを生成
   * @param filePath ファイルパス
   */
  generateSlug(filePath: string): string {
    // 拡張子を削除
    const withoutExt = filePath.replace(/\.[^/.]+$/, '');

    // basePath からの相対パスに変換
    const relativePath = path.isAbsolute(withoutExt)
      ? path.relative(this.basePath, withoutExt)
      : withoutExt;

    // スラッシュをハイフンに変換してスラグ化
    return relativePath
      .replace(/\\/g, '/') // Windowsパスの場合
      .replace(/^\/+|\/+$/g, '') // 先頭と末尾のスラッシュを削除
      .replace(/\//g, '-') // スラッシュをハイフンに変換
      .toLowerCase(); // 小文字に変換
  }
}

/**
 * エイリアス解決ロジック
 */
export class AliasResolver {
  constructor(private aliases: PathAlias[]) {}

  /**
   * エイリアスを実際のパスに解決
   * @param pathWithAlias エイリアスを含むパス
   */
  resolveAlias(pathWithAlias: string): string {
    for (const alias of this.aliases) {
      if (pathWithAlias.startsWith(alias.alias)) {
        return pathWithAlias.replace(alias.alias, alias.path);
      }
    }

    return pathWithAlias;
  }
}
