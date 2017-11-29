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
          <button onClick={this.move} className="btn btn-left" value="left">Left</button>
          <button onClick={this.move} className="btn btn-up" value="up">Up</button>
          <button onClick={this.move} className="btn btn-right" value="right">Right</button>
        </div>
      </div>
    );
  }
});

render(<App/>, document.getElementById('root'));
