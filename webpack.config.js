const path = require('path');
const https = require('https');
const SaveRemoteFilePlugin = require('save-remote-file-webpack-plugin');



module.exports = {
  mode: 'development',
  entry: {
    'dxr': './src/dxr.js',
    'searchfox': './src/searchfox.js',
    'socorro': './src/socorro.js',
    'hgmo': './src/hgmo.js',
  },
  plugins: [
  ],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js'
  },
  resolve : {
    modules : ['src', 'assets'],
  },
};