import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import rollupJson from '@rollup/plugin-json'
import { sizeSnapshot } from 'rollup-plugin-size-snapshot'

export default {
  input: 'assets/js/main.js',
  output: {
    file: 'public/bundle.js',
    format: 'iife'
  },
  plugins: [
    commonjs(),
    rollupJson(),
    nodeResolve({preferBuiltins: false}),
    sizeSnapshot()
  ]

}
