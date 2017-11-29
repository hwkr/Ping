import Phaser from 'phaser';

let socket = io.connect();

const assets = {
  'sky': { type: 'image', src: require('../../assets/sky.png') },
  'ground': { type: 'image', src: require('../../assets/platform.png') },
  'dude': { type: 'spritesheet', src: require('../../assets/dude.png'), width: 32, height: 48 }
}

const Game = React.createClass({
  getInitialState() {
    return { players: [] };
  },

  componentDidMount() {
    const component = this;
    socket.on('connect', function (data) {
      socket.emit("subscribe", { room: "game" });
    });
    socket.on('add-player', function(id) {
      console.log('Add player: ' + id);
      component.addPlayer(id);
    })
    socket.on('remove-player', function(id) {
      console.log('Remove player: ' + id);
      component.removePlayer(id);
    })
    socket.on('jump-player', function(id, direction) {
    })
    this.gameRef = Phaser.GAMES[0];
  },

  addPlayer(playerId) {
    const players = this.state.players.slice();
    players.push({id: playerId})
    this.setState({ players: players })
  },

  removePlayer(playerId) {
    this.setState({ players: this.state.players.filter(function (_) {
      return _.id !== playerId;
    })});
  },

  render() {
    var players = this.state.players.map(function (player, i) {
      return <sprite key={player.id} x={960} y={540} assetKey="dude"
        bodyPhysics={true} bodyBounceY={0.2} bodyGravityY={300}
        bodyCollideWorldBounds={true}>
      </sprite>
    });
    return (
      <game assets={assets} width={1920} height={1080} physics={Phaser.Physics.ARCADE}>
        <sprite assetKey="sky" />
        <group name="platforms" enableBody={true}>
          <sprite name="ground" assetKey="ground" y={1080 - 64} scale={{ x: 6, y: 2 }} bodyImmovable={true} />
          <sprite name="ledge1" assetKey="ground" x={400} y={400} bodyImmovable={true} />
          <sprite name="ledge2" assetKey="ground" x={-150} y={250} bodyImmovable={true} />
        </group>
        <group name="players" enableBody={true}>
            <collides with="platforms"/>
            {players}
        </group>
      </game>
    );
  }
});

React.render(<Game />, 'game');