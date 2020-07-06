const path = require('path');
const { uglify } = require('rollup-plugin-uglify');
const typescript = require('@rollup/plugin-typescript');

module.exports = {
    input: 'src/lift.ts',
    output: {
        dir: 'dist',
        name: 'lift.js',
        format: 'umd'
    }, 
    plugins: [
        typescript(),
        uglify()
    ],
}