import React from 'react';
import { render } from 'react-dom';

import './assets/stylesheets/styles.less';

let socket = io.connect();

const App = React.createClass({
  componentDidMount() {
    socket.on('connect', function(data) {
      socket.emit('join', 'Player connected!');
    });
  },

  move(e) {
    socket.emit('move', e.target.value);
  },

  render() {
    return (
      <div className="player">
        <div className="controls">
          <button onClick={this.move} className="btn btn-left" value="left">
          </button>
          <button onClick={this.move} className="btn btn-up" value="up">
          </button>
          <button onClick={this.move} className="btn btn-right" value="right">
          </button>
        </div>
      </div>
    );
  }
});

render(<App/>, document.getElementById('root'));
