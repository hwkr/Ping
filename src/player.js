import React from 'react';
import { render } from 'react-dom';

import './assets/stylesheets/styles.less';

let socket = io.connect();

const App = React.createClass({

  getInitialState() {
    return {
      score: 0
    };
  },

  componentDidMount() {
    const t = this;
    socket.on('connect', function (data) {
      socket.emit('join', 'Player connected!');
    });
    socket.on('score', function (data) {
      t.setState({ score: data.score });
    });
  },

  move(e) {
    socket.emit('move', e.target.value);
  },

  render() {
    return (
      <div className="player">
        <h1 className="score">
          {this.state.score}
        </h1>
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

render(<App />, document.getElementById('root'));
