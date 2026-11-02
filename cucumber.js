// Cucumber CLI configuration (auto-discovered as cucumber.js).
module.exports = {
  default: {
    paths: ['features/**/*.feature'],
    requireModule: ['ts-node/register'],
    require: ['hooks/hooks.ts', 'step-definitions/login.steps.ts'],
    format: [
      'progress',
      'json:reports/cucumber-report.json',
      'html:reports/cucumber-report.html',
    ],
    formatOptions: {
      snippetInterface: 'async-await',
    },
  },
};
