// eslint-disable-next-line @typescript-eslint/no-var-requires
const { defaults: tsjPreset } = require('ts-jest/presets');

module.exports = {
  transform: tsjPreset.transform,
  testEnvironment: 'node',
  preset: '@shelf/jest-mongodb',
  setupFilesAfterEnv: ['./jest.setup.ts'],
};
