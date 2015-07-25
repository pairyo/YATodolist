exports.run = function() {
  var Store = require('./Store');
  var Projects = require ('./Todos');
  var React = require ('react');
  React.render(<Projects />, document.body);
};
