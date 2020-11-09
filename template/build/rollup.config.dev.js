const rollup = require('rollup');
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss';
import serve from 'rollup-plugin-serve'


const html = require('@rollup/plugin-html');
const fs = require('fs');

const utils = require('./utils');

const cwdRoot = utils.cwdRoot;

const templateHtml = fs.readFileSync(cwdRoot('test/template.html'), 'utf8');

const config = {
    input: cwdRoot('test/template.tsx'),
    output: {
        name: 'runner',
        file: cwdRoot('test/index.js'),
        format: 'iife'
    },
    plugins: [
        nodeResolve(),
        commonjs(),
        typescript(),
        babel({ babelHelpers: 'runtime' }),
        replace({
            'process.env.NODE_ENV': JSON.stringify('development')
        }),
        html({
            fileName: 'index.html',
            template: () => templateHtml,
        }),
        postcss({
            extract: true,
            config: true,
            modules: true,
        }),
        serve({
            open: false,
            openPage: 'index.html',
            contentBase: 'test',
            port: 1010
        })
    ],
    watch: {
        include: 'src/**',
        exclude: 'node_modules/**'
    }
};

export default config;
