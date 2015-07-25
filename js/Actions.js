var $ = require('jquery');
var Dispatcher = require('./Dispatcher');
var Constants = require('./Constants');

module.exports = {
  todosUpdate(todo) {
    $.post(`/todos/${todo._id}/update`, todo).done(data => {
      if (data.state === 'yes') {
        Dispatcher.dispatch({
          actionType: Constants.TODO_SET,
          todo: todo
        });
      }
    }, 'json');
  },

  todosRemove(id) {
    $.getJSON(`/todos/${id}/remove`, {}, data => {
      if (data.state === 'yes') {
        Dispatcher.dispatch({
          actionType: Constants.TODO_REMOVE,
          id: id
        });
      }
    });
  },

  todosCreate(todo) {
    $.post('/todos/create', todo).done((newTodo) => {
      Dispatcher.dispatch({
        actionType: Constants.TODO_SET,
        todo: newTodo
      });
    }, 'json');
  },

  todosIndex() {
    $.getJSON('/todos/index', {}, todos => {
      Dispatcher.dispatch({
        actionType: Constants.TODOS_SET,
        todos: todos
      });
    });
  }
};