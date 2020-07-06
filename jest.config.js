module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverage: true,
    collectCoverageFrom: ['<rootDir>/src/**.ts'],
    coverageDirectory: 'output2test'
};