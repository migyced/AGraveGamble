class End extends Phaser.Scene {
    constructor(){
        super("endScene");
    }

    preload(){
        this.load.image('end', 'assets/end_screen.png');
    }

    create(){
        var image = this.add.image(game.config.width/2, game.config.height/2,'end_bg');
        var button_menu = this.add.image(game.config.width/2+195, game.config.height/2+110,'button_menu');
        var button_retry = this.add.image(game.config.width/2+195, game.config.height/2+25,'button_retry');

        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(keyUP)){
            this.scene.start("playScene");
        }
        if(Phaser.Input.Keyboard.JustDown(keyDOWN)) {
            this.scene.start("menuScene");
        }
    }
}