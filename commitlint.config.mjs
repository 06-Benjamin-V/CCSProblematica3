export default {
  extends: ['@commitlint/config-conventional'],
  defaultIgnores: false,
  // Git genera estos mensajes al integrar ramas; los commits de trabajo se validan.
  ignores: [(message) => /^Merge (?:pull request|branch|remote-tracking branch) /u.test(message)],
  rules: {
    'scope-empty': [2, 'never'],
    'scope-case': [2, 'always', 'kebab-case'],
    'subject-case': [0],
    'header-max-length': [2, 'always', 100],
    'type-enum': [2, 'always', [
      'feat', 'fix', 'docs', 'style', 'refactor', 'perf',
      'test', 'build', 'ci', 'chore', 'revert',
    ]],
  },
  helpUrl: 'https://www.conventionalcommits.org/es/v1.0.0/',
};
