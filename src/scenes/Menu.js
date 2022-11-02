class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // load audio
        // this.load.audio('sfx_select', './assets/blip_select12.wav');
        // this.load.image('menu', 'assets/main_menu.png');
    }

    create() {
        // menu text configuration
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        //background image
        var image = this.add.image(game.config.width/2, game.config.height/2,'main_menu');
        var playButton = this.add.sprite(game.config.width/2, game.config.height/2,'button_play').setScale(2,2);

        // show menu text
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'START GAME', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color = '#000';
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'Press SPACE to start', menuConfig).setOrigin(0.5);

        // define keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
          // Novice mode
          game.settings = {
            gameTimer: 120000,
            maxAlcohol: 3,
          }
          // this.sound.play('sfx_select');
          this.scene.start("playScene");    
        }
        
      }
}