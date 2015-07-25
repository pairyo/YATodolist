var _ = require('underscore');
var $ = require('jquery');
var I = require('immutable');
var Constants = require('./Constants');
var Dispatcher = require('./Dispatcher');
var EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = 'change';

var RootStore = _.extend({
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
}, EventEmitter.prototype);

var _iStore = I.fromJS({
  todos: {}
});

var store = _.extend({
  getStore() {
    return _iStore;
  },

  todosSet(todos) {
    todos = _.reduce(todos, (memo, todo) => {
      memo[todo._id] = todo;
      return memo;
    }, {});
    _iStore = _iStore.set('todos', I.fromJS(todos));
  }
}, RootStore);

Dispatcher.register(function (action) {
  switch (action.actionType) {
    case Constants.TODOS_SET:
      store.todosSet(action.todos);
      break;
    case Constants.TODO_SET:
      var todo = action.todo;
      _iStore = _iStore.setIn(['todos', todo._id], I.fromJS(todo));
      break;
    case Constants.TODO_REMOVE:
      _iStore = _iStore.deleteIn(['todos', action.id]);
      break;
    default:
  }
  store.emitChange();
});

module.exports = store;