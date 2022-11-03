class End extends Phaser.Scene {
    constructor(){
        super("endScene");
    }

    preload(){
        
    }

    create(){
        var image = this.add.image(game.config.width/2, game.config.height/2,'end_bg');
        this.button_menu = this.add.image(game.config.width/2+195, game.config.height/2+110,'button_menu');
        this.button_menu.setInteractive({
            useHandCursor: true,
        });
        this.button_retry = this.add.image(game.config.width/2+195, game.config.height/2+25,'button_retry');
        this.button_retry.setInteractive({
            useHandCursor: true,
        });

        //Adding button functionality
        this.input.on('gameobjectdown', (pointer, gameObject, event) => {
            if (gameObject == this.button_retry){
                this.scene.start("playScene");
            }   
            if (gameObject == this.button_menu){
                this.scene.start("menuScene");
            }   
        });

        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    }

    update(){
        //music loop?
        if(!music.isPlaying){
            music.play();
        }
        
        if(Phaser.Input.Keyboard.JustDown(keyUP)){
            this.scene.start("playScene");
        }
        if(Phaser.Input.Keyboard.JustDown(keyDOWN)) {
            this.scene.start("menuScene");
        }
    }
}