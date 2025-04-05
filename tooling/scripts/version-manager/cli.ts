import { VersionManager } from './version-manager';
import { LoadingSpinner } from './utils/loading';

async function main() {
  const manager = new VersionManager(process.cwd());
  const spinner = new LoadingSpinner();

  spinner.start('🔄 初期化中...');
  await manager.initialize();
  spinner.stop();

  const command = process.argv[2];
  const groupName = process.argv[3];

  switch (command) {
    case 'check': {
      spinner.start('🔍 バージョンをチェック中...');
      const { mismatches, hasNewerVersions, undefinedPackages } =
        await manager.checkVersionMismatches();
      spinner.stop();

      let hasIssues = false;

      if (undefinedPackages.length > 0) {
        console.log(
          '\n📦 バージョン設定に未登録のパッケージが見つかりました：'
        );
        console.table(
          undefinedPackages.map((pkg) => ({
            name: pkg.name,
            currentVersion: pkg.version,
            location: pkg.location,
          }))
        );
        console.log(
          '\n⚠️  これらのパッケージをバージョン設定に追加する必要があります。'
        );
        hasIssues = true;
      }

      if (mismatches.length > 0) {
        console.log('\n🔍 バージョンの不一致が見つかりました：');
        hasIssues = true;

        const newer = mismatches.filter((m) => m.isNewer);
        const older = mismatches.filter((m) => !m.isNewer);

        if (newer.length > 0) {
          console.log('\n⬆️  期待バージョンより新しいパッケージ：');
          console.table(newer);
          console.log(
            '\n💡 一部のパッケージが新しいバージョンを使用しています。期待バージョンの更新を検討してください。'
          );
        }

        if (older.length > 0) {
          console.log('\n⬇️  期待バージョンより古いパッケージ：');
          console.table(older);
        }

        console.log('\n📝 更新方法を選択してください：');
        console.log('1. 🔄 全てのパッケージを更新');
        console.log('2. 🎯 更新するパッケージを選択');
        console.log('3. ⏭️ 更新をスキップ');

        const response = await new Promise<string>((resolve) => {
          const stdin = process.stdin;
          const stdout = process.stdout;

          stdout.write('選択してください（1-3）：');
          stdin.resume();
          stdin.setEncoding('utf8');

          stdin.once('data', (data) => {
            stdin.pause();
            resolve(data.toString().trim());
          });
        });

        switch (response) {
          case '1': {
            spinner.start('🔄 パッケージを更新中...');
            const result = await manager.updateVersions();
            spinner.stop();

            if (result.success) {
              console.log(
                '🎉 全てのパッケージの更新が完了しました！',
                result.updates
              );
            } else {
              console.error('❌ 更新に失敗しました：', result.error);
              process.exit(1);
            }
            break;
          }
          case '2': {
            const selectedPackages =
              await manager.selectPackagesForUpdate(mismatches);
            if (selectedPackages.length === 0) {
              console.log('ℹ️  更新するパッケージが選択されていません。');
              break;
            }

            spinner.start('🔄 選択したパッケージを更新中...');
            const result = await manager.updateVersions(
              undefined,
              selectedPackages
            );
            spinner.stop();

            if (result.success) {
              console.log(
                '🎉 選択したパッケージの更新が完了しました！',
                result.updates
              );
            } else {
              console.error('❌ 更新に失敗しました：', result.error);
              process.exit(1);
            }
            break;
          }
          case '3':
            console.log('ℹ️  更新をスキップしました。');
            break;
          default:
            console.log('❌ 無効な選択です。更新をスキップします。');
        }
      }

      if (!hasIssues) {
        console.log('✨ バージョンの不一致や未登録のパッケージはありません！');
      }
      break;
    }

    case 'update:selected': {
      spinner.start('🔍 バージョンをチェック中...');
      const { mismatches } = await manager.checkVersionMismatches();
      spinner.stop();

      if (mismatches.length === 0) {
        console.log('✨ バージョンの不一致は見つかりませんでした。');
        break;
      }

      const selectedPackages =
        await manager.selectPackagesForUpdate(mismatches);
      if (selectedPackages.length === 0) {
        console.log('ℹ️  更新するパッケージが選択されていません。');
        break;
      }

      const result = await manager.updateVersions(undefined, selectedPackages);

      if (result.success) {
        if (result.message) {
          console.log(result.message);
        }
      } else {
        console.error('❌ 更新に失敗しました：', result.error);
        process.exit(1);
      }
      break;
    }

    case 'update': {
      const result = await manager.updateVersions(groupName);

      if (result.success) {
        if (result.message) {
          console.log(result.message);
        }
      } else {
        console.error('❌ 更新に失敗しました：', result.error);
        process.exit(1);
      }
      break;
    }

    default:
      console.log(`
📚 使用方法：
  🔍 バージョンチェック：
    bun run version-manager/cli.ts check
  
  🔄 パッケージの更新：
    bun run version-manager/cli.ts update [group-name]
  
  🎯 選択的な更新：
    bun run version-manager/cli.ts update:selected
      `);
      process.exit(1);
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error('❌ エラーが発生しました：', error);
    process.exit(1);
  });
}

export default main;
