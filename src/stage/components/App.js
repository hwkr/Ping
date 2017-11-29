import React from 'react-phaser';

let socket = io.connect();

const assets = {
  'sky': { type: 'image', src: require('../../assets/sky.png') },
  'ground': { type: 'image', src: require('../../assets/platform.png') },
  'dude': { type: 'spritesheet', src: require('../../assets/dude.png'), width: 32, height: 48 }
}

const MyGame = React.createClass({
  getInitialState() {
    return {};
  },

  componentDidMount() {
    socket.on('connect', function (data) {
      socket.emit('join', 'stage');
    });
  },

  onInput(context) {
    var player = context.nodes.player.obj,
      cursors = context.input.cursors;

    if (cursors.left.isDown) {
      player.body.velocity.x = -200;
      player.animations.play('left');
    } else if (cursors.right.isDown) {
      player.body.velocity.x = 200;
      player.animations.play('right');
    } else {
      player.body.velocity.x = 0;
      player.animations.stop();
      player.frame = 4;
    }

    if (cursors.up.isDown && player.body.touching.down) {
      player.body.velocity.y = -500;
    }
  },

  render() {
    return (
      <game assets={assets} width={1920} height={1080} physics={Phaser.Physics.ARCADE}>
        <sprite assetKey="sky" />
        <group name="platforms" enableBody={true}>
          <sprite name="ground" assetKey="ground" y={1080 - 64} scale={{ x: 6, y: 2 }} bodyImmovable={true} />
          <sprite name="ledge1" assetKey="ground" x={400} y={400} bodyImmovable={true} />
          <sprite name="ledge2" assetKey="ground" x={-150} y={250} bodyImmovable={true} />
        </group>
        <sprite name="player" x={32} y={450} assetKey="dude"
          bodyPhysics={true} bodyBounceY={0.2} bodyGravityY={300}
          bodyCollideWorldBounds={true}>
          <animation id="left" frames={[0, 1, 2, 3]} fps={10} loop={true} />
          <animation id="right" frames={[5, 6, 7, 8]} fps={10} loop={true} />
          <collides with="platforms" />
        </sprite>
        <input cursors={true} onInput={this.onInput} />
      </game>
    );
  }
});

React.render(<MyGame />, 'game');