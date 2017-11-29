import './assets/stylesheets/base.scss';

const socket = io.connect();

let players,
    platforms,
    cursors;

const game = new Phaser.Game(
  800, 600,
  Phaser.AUTO,
  'game',
  {
    preload() {

      game.load.image('sky', require('./assets/sky.png'));
      game.load.image('ground', require('./assets/platform.png'));
      game.load.spritesheet('dude', require('./assets/dude.png'), 32, 48);
      game.stage.disableVisibilityChange = true;

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
      game.add.sprite(0, 0, 'sky');

      platforms = game.add.group();
      platforms.enableBody = true;
      var ground = platforms.create(0, game.world.height - 64, 'ground');
      ground.scale.setTo(2, 2);
      ground.body.immovable = true;
      var ledge = platforms.create(400, 400, 'ground');
      ledge.body.immovable = true;
      ledge = platforms.create(-150, 250, 'ground');
      ledge.body.immovable = true;

      players = game.add.group();
      console.log(platforms);

      //  Our controls.
      cursors = game.input.keyboard.createCursorKeys();
  },
  update() {
      game.physics.arcade.collide(players, platforms);
      players.forEach((player) => {
        if (player.body.touching.down) player.body.velocity.x /= 2;
      });
    }
  });


function addPlayer(playerId) {
  const player = game.add.sprite(200, game.world.height - 200, 'dude');

  player.id = playerId;
  player.power = 10;

  game.physics.arcade.enable(player);
  player.body.bounce.y = 0.2;
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
  if (player.body.touching.down)
  {
    if (direction === 'right') player.body.velocity.x = 10*player.power;
    if (direction === 'left') player.body.velocity.x = -10*player.power;
    player.body.velocity.y = -20*player.power;
  }
}
