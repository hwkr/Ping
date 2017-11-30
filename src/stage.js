import './assets/stylesheets/styles.less';
import tileMap from '!json-loader!./assets/environment/map.json';

const socket = io.connect();

let players,
    middleground,
    background,
    layers = {},
    map;

const gameWidth = 640;
const gameHeight = 480;

const game = new Phaser.Game(
  gameWidth, gameHeight,
  Phaser.AUTO,
  'game',
  {
    preload() {

      game.load.spritesheet('dude', require('./assets/dude.png'), 32, 48);

      game.load.image('background', require('./assets/environment/back.png'));
      game.load.image('middleground', require('./assets/environment/middle.png'));
      game.load.image('tileset', require('./assets/environment/tileset.png'));
      game.load.tilemap('map', require('./assets/environment/map.json'), null, Phaser.Tilemap.TILED_JSON);

      socket.on('connect', function (data) {
        socket.emit("subscribe", { room: "game" });
      });
      socket.on('add-player', function(id) {
        console.log('Add player: ' + id);
        addPlayer(id);
      })
      socket.on('remove-player', function(id) {
        console.log('Remove player: ' + id);
        removePlayer(id);
      })
      socket.on('move-player', function({ id, direction }) {
        movePlayer(id, direction);
      })
    },
    create() {
      game.physics.startSystem(Phaser.Physics.ARCADE);

      // world background
      background = game.add.tileSprite(0, 0, gameWidth, gameHeight, 'background');
      middleground = game.add.tileSprite(0, 120, gameWidth, gameHeight, 'middleground');

      // world tiles
      map = game.add.tilemap('map');
      map.addTilesetImage('tileset', 'tileset');
      layers.background = map.createLayer('Background');
      layers.ground = map.createLayer('Ground');
      layers.decorations = map.createLayer('Decoration');

      map.setCollisionBetween(1, 1000, true, layers.ground);
      setTileCollision(layers.ground, [ 35, 36, 134, 135, 262, 366, 368, 370 ], { top: true, bottom: false, left: false, right: false });

      layers.background.resizeWorld();

      players = game.add.group();

      game.scale.pageAlignHorizontally = true;
      game.scale.pageAlignVertically = true;
      game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      game.stage.disableVisibilityChange = true;
      game.renderer.renderSession.roundPixels = true; // no blurring
  },
  update() {
      game.physics.arcade.collide(players, layers.ground);
      game.physics.arcade.collide(players);

      players.forEach((player) => {
        if (player.body.onFloor()) player.body.velocity.x /= 2;
      });
    }
  }
);



function addPlayer(playerId) {
  const player = game.add.sprite(game.world.width / 2, game.world.height - 300, 'dude');

  player.id = playerId;
  player.power = 10;

  game.physics.arcade.enable(player);
  player.body.bounce.y = 0.5;
  player.body.bounce.x = 0.5;
  player.body.gravity.y = 300;
  player.body.collideWorldBounds = true;

  players.add(player);
}

function removePlayer(playerId) {
  const player = players.children.find((e) => e.id === playerId );
  if (player) player.kill();
}

function movePlayer(playerId, direction) {
  const player = players.children.find((e) => e.id === playerId );
  if (!player) {
    addPlayer(playerId);
    return;
  }
  if (direction === 'right') player.body.velocity.x = 10*player.power;
  if (direction === 'left') player.body.velocity.x = -10*player.power;
  if (player.body.onFloor())
  {
    player.body.velocity.y = -20*player.power;
  }
}

function setTileCollision(mapLayer, idxOrArray, dirs) {

  var mFunc; // tile index matching function
  if (idxOrArray.length) {
      // if idxOrArray is an array, use a function with a loop
      mFunc = function(inp) {
          for (var i = 0; i < idxOrArray.length; i++) {
              if (idxOrArray[i] === inp) {
                  return true;
              }
          }
          return false;
      };
  } else {
      // if idxOrArray is a single number, use a simple function
      mFunc = function(inp) {
          return inp === idxOrArray;
      };
  }

  // get the 2-dimensional tiles array for this layer
  var d = mapLayer.map.layers[mapLayer.index].data;

  for (var i = 0; i < d.length; i++) {
      for (var j = 0; j < d[i].length; j++) {
          var t = d[i][j];
          if (mFunc(t.index)) {

              t.collideUp = dirs.top;
              t.collideDown = dirs.bottom;
              t.collideLeft = dirs.left;
              t.collideRight = dirs.right;

              t.faceTop = dirs.top;
              t.faceBottom = dirs.bottom;
              t.faceLeft = dirs.left;
              t.faceRight = dirs.right;

          }
      }
  }
 }

