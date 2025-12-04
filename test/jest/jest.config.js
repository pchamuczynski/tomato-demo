export default {
    testEnvironment: 'node',
    transform: {},
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    testMatch: ['**/test/jest/**/*.test.js'],
    collectCoverageFrom: [
        'script.js', 
        '!**/node_modules/**',
    ],
};