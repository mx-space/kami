/*
 * @Author: Innei
 * @Date: 2020-06-13 11:08:49
 * @LastEditTime: 2020-06-13 13:30:50
 * @LastEditors: Innei
 * @FilePath: /mx-web/jest.config.js
 * @Coding with Love
 */
const path = require('path')
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/'],
  rootDir: './',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],

  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.(js|jsx)$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.css$': '<rootDir>/configs/jest/cssTransform.js',
  },
  testMatch: ['**/*.(test|spec).(ts|tsx)'],
  coveragePathIgnorePatterns: ['/node_modules/', 'startTest.js'],
  setupFilesAfterEnv: ['<rootDir>/startTest.js'],
  coverageReporters: ['json', 'lcov', 'text', 'text-summary'],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.jest.json',
    },
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  moduleNameMapper: {
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/mocks.js',
    '\\.(css|less|scss)$': '<rootDir>/__mocks__/mocks.js',
  },
  moduleDirectories: [path.resolve(__dirname, 'node_modules'), '<rootDir>/'],
}
