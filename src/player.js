import React from 'react';
import { render } from 'react-dom';

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
      <div>
        <button onClick={this.move} value="left">Left</button>
        <button onClick={this.move} value="up">Up</button>
        <button onClick={this.move} value="right">Right</button>
      </div>
    );
  }
});

render(<App/>, document.getElementById('root'));
