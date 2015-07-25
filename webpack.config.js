var path = require('path');
module.exports = {
  module: {
    loaders: [
      {test: /\.json$/, loader: 'json'},
      {test: /\.js$/, loader: 'jsx-loader?harmony'}
    ]
  },

  context: __dirname + '/js',

  entry: {
    index: './index.js'
  },

  output: {
    path: path.join(__dirname, "/public/js"),
    filename: "[name].js",
    publicPath: "/js",
    library: '[name]'
  },

  externals: {
  },

  resolve: {
    root: 'app/assets',
    modulesDirectories: ['node_modules', 'bower_components', 'vendor/assets/javascripts'],
    alias: {'react$': 'react/addons'}
  },

  node: {
    global: true,
    console: true,
    process: true
  }
};
