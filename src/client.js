import 'todomvc-common';
import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';

const initialState = window.initialState && JSON.parse(window.initialState) || {};

ReactDOM.render(
	<App />,
	document.getElementById('todoapp')
);

if (module.hot) {
  module.hot.accept('./App', () => {
    var NewTodoApp = require('./components/App').default;
    ReactDOM.render(
      <NewTodoApp todoStore={todoStore} viewStore={viewStore}/>,
      document.getElementById('todoapp')
    );
  });
}

