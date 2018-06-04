var path = require('path');

module.exports = {
  entry: './javascripts/main.js',
  output: {
    path: path.resolve(__dirname, 'javascripts'),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        exclude: /(node_modules)/,
        },
    ]
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '*']
  }
};
