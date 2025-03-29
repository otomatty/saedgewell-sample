import { execSync } from 'node:child_process';

// check requirements to run Makerkit
void checkRequirements();

function checkRequirements() {
  checkNodeVersion();
  checkPathNotOneDrive();
  checkBunVersion();
}

/**
 * Checks if the current bun version is compatible with Makerkit.
 * If the current bun version is not compatible, it exits the script with an error message.
 */
function checkBunVersion() {
  const requiredBunVersion = '>=1.0.0';
  const currentBunVersion = execSync('bun --version').toString().trim();
  const [major = 0, minor = 0] = currentBunVersion.split('.').map(Number);

  if (!currentBunVersion) {
    console.error(
      '\x1b[31m%s\x1b[0m',
      `You are running Makerkit from a directory that does not have bun installed. Please install bun and run "bun install" in your project directory.`
    );

    process.exit(1);
  }

  if (major < 1) {
    console.error(
      '\x1b[31m%s\x1b[0m',
      `You are running bun ${currentBunVersion}. Makerkit requires bun ${requiredBunVersion}.`
    );

    process.exit(1);
  }

  console.log(`You are running bun ${currentBunVersion}.`);
}

/**
 * Checks if the current Node version is compatible with Makerkit.
 * If the current Node version is not compatible, it exits the script with an error message.
 */
function checkNodeVersion() {
  const requiredNodeVersion = '>=v18.18.0';
  const currentNodeVersion = process.versions.node;
  const [major = 0, minor = 0] = currentNodeVersion.split('.').map(Number);

  if (major < 18 || (major === 18 && minor < 18)) {
    console.error(
      '\x1b[31m%s\x1b[0m',
      `You are running Node ${currentNodeVersion}. Makerkit requires Node ${requiredNodeVersion}.`
    );

    process.exit(1);
  } else {
    console.log(`You are running Node ${currentNodeVersion}.`);
  }
}

/**
 * Checks if the current working directory is not OneDrive.
 * If the current working directory is OneDrive, it exits the script with an error message.
 */
function checkPathNotOneDrive() {
  const path = process.cwd();

  if (path.includes('OneDrive')) {
    console.error(
      '\x1b[31m%s\x1b[0m',
      'You are running Makerkit from OneDrive. Please move your project to a local folder.'
    );

    process.exit(1);
  }
}
