class End extends Phaser.Scene {
    constructor(){
        super("endScene");
    }

    preload(){
        
    }

    create(){
        //constants that move the text around
        this.xConst = game.config.width/3;
        this.yConst = game.config.height/2 + 70;

        this.dialogueConfig = {
            fontFamily: 'CustomFont',
            fontSize: '28px',
            color: '#f5f5dc',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5,
            },
            wordWrap: {width: 275, useAdvancedWrap: true}
        }
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
        this.bad_bad_ending = this.loadWords('bad_bad_ending');
        this.bad_good_ending = this.loadWords('bad_good_ending');
        this.bad_neutral_good_ending = this.loadWords('bad_neutral_good_ending');
        this.bad_neutral_bad_ending = this.loadWords('bad_neutral_bad_ending');
        this.neutral_good_ending = this.loadWords('neutral_good_ending');
        this.neutral_bad_ending = this.loadWords('neutral_bad_ending');
        this.good_neutral_good_ending = this.loadWords('good_neutral_good_ending');
        this.good_neutral_bad_ending = this.loadWords('good_neutral_bad_ending');
        this.good_good_ending = this.loadWords('good_good_ending');
        this.good_bad_ending = this.loadWords('good_bad_ending');

        if( incorrectGhosts > correctGhosts){
            console.log("Loser!");
            if(iGoodNeutralBad == 1){
                this.add.text(this.xConst, this.yConst, this.good_bad_ending[firstIncorrect], this.dialogueConfig).setOrigin(0.5);
            }else if(iGoodNeutralBad == 2){
                this.add.text(this.xConst, this.yConst, this.good_neutral_bad_ending[firstIncorrect], this.dialogueConfig).setOrigin(0.5);
            }else if(iGoodNeutralBad == 3){
                this.add.text(this.xConst, this.yConst, this.neutral_bad_ending[firstIncorrect], this.dialogueConfig).setOrigin(0.5);
            }else if(iGoodNeutralBad == 4){
                this.add.text(this.xConst, this.yConst, this.bad_neutral_bad_ending[firstIncorrect], this.dialogueConfig).setOrigin(0.5);
            }else if(iGoodNeutralBad == 5){
                this.add.text(this.xConst, this.yConst, this.bad_bad_ending[firstIncorrect], this.dialogueConfig).setOrigin(0.5);
            }
        }else{
            console.log("Winner!");
            if(cGoodNeutralBad == 1){
                this.add.text(this.xConst, this.yConst, this.good_good_ending[firstCorrect], this.dialogueConfig).setOrigin(0.5);
            }else if(cGoodNeutralBad == 2){
                this.add.text(this.xConst, this.yConst, this.good_neutral_good_ending[firstCorrect], this.dialogueConfig).setOrigin(0.5);
            }else if(cGoodNeutralBad == 3){
                this.add.text(this.xConst, this.yConst, this.neutral_good_ending[firstCorrect], this.dialogueConfig).setOrigin(0.5);
            }else if(cGoodNeutralBad == 4){
                this.add.text(this.xConst, this.yConst, this.bad_neutral_good_ending[firstCorrect], this.dialogueConfig).setOrigin(0.5);
            }else if(cGoodNeutralBad == 5){
                this.add.text(this.xConst, this.yConst, this.bad_good_ending[firstCorrect], this.dialogueConfig).setOrigin(0.5);
            }
        }
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

    loadWords(inFile) {
        let cache = this.cache.text;
        let allWords = cache.get(inFile);
        this.endArray = allWords.split('\n');
        for(let i = 0; i < this.endArray.length; i++){
            this.endArray[i] = this.endArray[i].trim();
        }
        return this.endArray;
    }
}