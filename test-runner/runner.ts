import { spawnSync } from 'node:child_process';
import path from 'node:path';

// This runner invokes Cucumber (not Playwright Test) and forwards CLI options
// such as feature paths and --tags to the Cucumber CLI.
const cucumberEntryPoint = path.resolve(
  path.dirname(require.resolve('@cucumber/cucumber')),
  '..',
  'bin',
  'cucumber.js',
);

const result = spawnSync(
  process.execPath,
  [cucumberEntryPoint, ...process.argv.slice(2)],
  {
    stdio: 'inherit',
    env: process.env,
  },
);

if (result.error) {
  throw new Error('Unable to start the Cucumber runner', { cause: result.error });
}

process.exitCode = result.status ?? 1;
