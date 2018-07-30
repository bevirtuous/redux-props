const jestConfig = require('@virtuous/react-unit-test-suite/jest.config');

module.exports = {
  ...jestConfig,
  testURL: 'http://locahost/',
  collectCoverageFrom: [
    'src/*/**/*.{js|jsx}',
  ],
};
