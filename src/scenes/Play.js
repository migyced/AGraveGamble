class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {

    }

    create() {
        //create background and sprites
        this.bg = this.add.sprite(game.config.width/2, game.config.height/2,'main_bg');
        this.desk = this.add.sprite(game.config.width/2, (game.config.height/2)+105,'desk');
        this.base_ghost = this.add.sprite(game.config.width/2-100, game.config.height/2-75,'base_ghost');
        this.dialogue_box = this.add.sprite(game.config.width/2+140, game.config.height/2-130,'dialogue_box');

        this.button_heaven = this.add.sprite(game.config.width/2+210, game.config.height/2-60,'button_heaven');
        this.button_heaven.setInteractive({
            useHandCursor: true,
        });
        this.button_hell = this.add.sprite(game.config.width/2+210, game.config.height/2+10,'button_hell');
        this.button_hell.setInteractive({
            useHandCursor: true,
        });


        this.manual = this.add.sprite(game.config.width/2+230, game.config.height/2+220,'manual');
        this.cup_2 = this.add.sprite(game.config.width/2-10, game.config.height/2+130,'cup_2');
        this.cup_1 = this.add.sprite(game.config.width/2+70, game.config.height/2+130,'cup_1');
        this.alcohol_1 = this.add.sprite(game.config.width/2-295, game.config.height/2+125,'alcohol_1');
        this.alcohol_2 = this.add.sprite(game.config.width/2-240, game.config.height/2+95,'alcohol_2');
        this.alcohol_3 = this.add.sprite(game.config.width/2-290, game.config.height/2+35,'alcohol_3');
        this.progressbar_1 = this.add.sprite(game.config.width/2-290, game.config.height/2-55,'progressbar_1');
        this.progressbar_1_fill = this.add.sprite(game.config.width/2-290, game.config.height/2-55, 'progressbar_1_fill');
        this.die1Sprite = this.add.sprite(game.config.width / 2 - 140, game.config.height / 2 + 100, 'dice_sheet');
        this.die2Sprite = this.add.sprite(game.config.width / 2 - 110, game.config.height / 2 + 125, 'dice_sheet');
        this.die3Sprite = this.add.sprite(game.config.width / 2 - 105, game.config.height / 2 + 90, 'dice_sheet');
        
        // animation config
        this.anims.create({
            key: 'roll',
            frames: this.anims.generateFrameNumbers('dice_sheet', { start: 0, end: 5, first: 0}),
            frameRate: 10
        });
        
        // =======
        // var bg = this.add.sprite(game.config.width/2, game.config.height/2,'main_bg');
        // var desk = this.add.sprite(game.config.width/2, (game.config.height/2)+105,'desk');
        // var base_ghost = this.add.sprite(game.config.width/2-100, game.config.height/2-75,'base_ghost');
        // var dialogue_box = this.add.sprite(game.config.width/2+140, game.config.height/2-130,'dialogue_box');
        // var button_heaven = this.add.sprite(game.config.width/2+210, game.config.height/2-60,'button_heaven');
        // var button_hell = this.add.sprite(game.config.width/2+210, game.config.height/2+10,'button_hell');
        // var manual = this.add.sprite(game.config.width/2+230, game.config.height/2+220,'manual');
        // var cup_2 = this.add.sprite(game.config.width/2-10, game.config.height/2+130,'cup_2');
        // var cup_1 = this.add.sprite(game.config.width/2+70, game.config.height/2+130,'cup_1');
        // var alcohol_1 = this.add.sprite(game.config.width/2-295, game.config.height/2+125,'alcohol_1');
        // var alcohol_2 = this.add.sprite(game.config.width/2-240, game.config.height/2+95,'alcohol_2');
        // var alcohol_3 = this.add.sprite(game.config.width/2-290, game.config.height/2+35,'alcohol_3');
        // var progressbar_1 = this.add.sprite(game.config.width/2-290, game.config.height/2-55,'progressbar_1');
        // var progressbar_1_fill = this.add.sprite(game.config.width/2-290, game.config.height/2-55,'progressbar_1_fill');
        this.correctSFX = this.sound.add('correctSFX');
        this.wrongSFX = this.sound.add('wrongSFX');


        // initialize alcohol
        this.alcohol = 0;
        
        // initialize drank alcohol state
        this.drank = false;
        
        // initialize number of ghosts correct
        this.correct = 0;

        //create arrays for quotes
        this.goodQuotes = this.loadWords('goodQuotes');
        this.goodNeutralQuotes = this.loadWords('goodNeutralQuotes');
        this.neutralQuotes = this.loadWords('neutralQuotes');
        this.badNeutralQuotes = this.loadWords('badNeutralQuotes');
        this.badQuotes = this.loadWords('badQuotes');
        
        // universal text config for printing out mechanics
        this.textConfig = {
            fontFamily: 'CustomFont',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
        }
        
        this.dialogueConfig = {
            fontFamily: 'CustomFont',
            fontSize: '28px',
            color: '#f5f5dc',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
        }
        // initial roll of dice - would player have to roll dice somehow?
        this.rollDice();
        

        // ghost dialogue
        this.quote = this.chooseQuote(this.diceSum);

        // GAME OVER flag
        this.gameOver = false;

        // 120-second play clock
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'DAY OVER', this.textConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press SPACE to Restart or ← to Menu', this.textConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
        
        // adding initalization of key spaces 
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        
        // testing if my chance calculation works works - REMOVE LATER
        for (let x = 3; x < 19; x++) {
            this.rollDiceTest(x);
        }
        
        
        // button functionality
        this.input.on('gameobjectdown', (pointer, gameObject, event) => {
            if (!this.gameOver) {
                if (gameObject == this.button_heaven){
                    this.sendToHeaven();
                }   
                if (gameObject == this.button_hell){
                    this.sendToHell();
                } 
            }
        });

        //test
    }

    update() {
        //music loop?
        if(!music.isPlaying){
            music.play();
        }        
        
        // had to destroy all text so it wouldn't rewrite itself
        if (this.alcoholText) {
            this.alcoholText.destroy();
            this.diceSumText.destroy();
            this.heavenText.destroy();
            this.scoreText.destroy();
            this.dialogueText.destroy();
        }
        
        //text for ghost refreshing
        this.dialogueText = this.add.text(game.config.width / 2 + 15, game.config.height / 10 - 3, this.quote, this.dialogueConfig);

        //debugging text that appears in orange
        this.alcoholText = this.add.text(borderPadding, borderPadding, "Alcohol: " + this.alcohol, this.dialogueConfig);
        this.diceSumText = this.add.text(borderPadding, borderPadding + 160, "Dice Sum: " + this.diceSum, this.dialogueConfig);
        this.scoreText = this.add.text(borderPadding, borderPadding + 240, "Number of Ghosts Correct: " + this.correct, this.dialogueConfig);
        if (this.heaven) {
            this.heavenText = this.add.text(borderPadding, borderPadding + 200, "Heaven", this.dialogueConfig);
        } else {
            this.heavenText = this.add.text(borderPadding, borderPadding + 200, "Hell", this.dialogueConfig);
        }
        

        // check key input for restart / menu
        if(this.gameOver){
            this.scene.start("endScene");
        }
        
        if (!this.gameOver) {
            // space to roll dice again to see mechanic - REMOVE LATER
            if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
                this.rollDice();
            }
            
            // player picked heaven for ghost
            if (Phaser.Input.Keyboard.JustDown(keyUP)) {
                this.sendToHeaven();
            }
            
            // player picked hell for ghost
            if (Phaser.Input.Keyboard.JustDown(keyDOWN)) {
                this.sendToHell();
            }
            
            // player drank alcohol
            if(Phaser.Input.Keyboard.JustDown(keyLEFT) && this.alcohol >= 1) {
                this.drank = true;
            }
        }
    }
    
    rollDice() {
        this.die1Sprite.anims.play('roll');
        this.die2Sprite.anims.play('roll');
        this.die3Sprite.anims.play('roll');
        
        
        // set drank alcohol state back to false since new ghost
        this.drank = false;
        
        // initialize dice
        // pick a random int between 1 and 6
        this.die1 = Phaser.Math.Between(1, 6);
        this.die2 = Phaser.Math.Between(1, 6);
        this.die3 = Phaser.Math.Between(1, 6);
        
        // sum up dice
        this.diceSum = this.die1 + this.die2 + this.die3;
        
        // initialize if going to heaven or hell
        // chances going to heaven = (18 - sum)/15
        // since sums are from 3 to 18
        // so if roll a 3, then (18-3)/15 = 15/15 = 1
        // so if roll a 18, then (18-18)/15 = 0/15 = 0
        this.chance = (18 - this.diceSum) / 15; 
        
        // pick a random int from 1 - 15, 1/15 chance for each number
        this.randomInt = Phaser.Math.Between(1, 15);
        
        // if the (18 - this.diceSum) is greater than or equal to the random int, then ghost would be going to heaven
        if ((18 - this.diceSum) > this.randomInt || (18 - this.diceSum) == this.randomInt) {
            this.heaven = true;
        } else {
            this.heaven = false;
        }
        

        //return diceSum
        this.quote = this.chooseQuote(this.diceSum);
        
        this.die1Sprite.on('animationcomplete', () => {    // callback after anim completes
            this.die1Sprite.setFrame(this.die1 - 1);
        });
        this.die2Sprite.on('animationcomplete', () => {    // callback after anim completes
            this.die2Sprite.setFrame(this.die2 - 1);
        });
        this.die3Sprite.on('animationcomplete', () => {    // callback after anim completes
            this.die3Sprite.setFrame(this.die3 - 1);
        });

        
        return this.diceSum;
    }
    
    // function to test probability calculations by doing it 100 times
    // REMOVE LATER
    rollDiceTest(diceRoll) {
        let heavenNum = 0;
        let hellNum = 0;
        let randomIntTest;
        
        // repeat 100 times and mark how many times sent to heaven or hell
        for (let x = 0; x < 100; x++) {
            randomIntTest = Phaser.Math.Between(1, 15);
            if ((18 - diceRoll) >= randomIntTest) {
                heavenNum++;
            } else {
                hellNum++;
            }
        }
        
        // print out results
        console.log("Dice Roll: " + diceRoll + " Probability: " + (18 - diceRoll) +
            "/" + 15 + " Probability(%): " + ((18 - diceRoll) / 15) * 100 + "%" +
            " Heaven: " + heavenNum + " Hell: " + hellNum);
    }
    
    sendToHeaven() {
        if (this.drank) {
            // play correct sound
            this.correctSFX.play();
            // increase correct number
            this.correct++;
            // print out score - REMOVE LATER
            this.scoreText = this.add.text(borderPadding, borderPadding + 240, "Number of Ghosts Correct: " + this.correct, this.textConfig);
            // update alcohol
            this.alcohol -= 1;
        } else if (this.heaven) {
            // play correct sound
            this.correctSFX.play();
            this.correct++;
            // print out score - REMOVE LATER
            this.scoreText = this.add.text(borderPadding, borderPadding + 240, "Number of Ghosts Correct: " + this.correct, this.textConfig);
            // update alcohol and make sure it isn't past the max
            this.alcohol += this.alcCalc();
            if (this.alcohol > 3) {
                this.alcohol = 3;
            }
        } else {
            // play incorrect sound
            this.wrongSFX.play();
        }
        
        // roll dice/spawn new ghost
        this.rollDice();
    }
    
    sendToHell() {
        if (this.drank) {
            // play correct sound
            this.correctSFX.play();
            // increase correct number
            this.correct++;
            // print out score - REMOVE LATER
            this.scoreText = this.add.text(borderPadding, borderPadding + 240, "Number of Ghosts Correct: " + this.correct, this.textConfig);
            // update alcohol
            this.alcohol -= 1;
        } else if (!this.heaven) {
            // play correct sound
            this.correctSFX.play();
            this.correct++;
            // print out score - REMOVE LATER
            this.scoreText = this.add.text(borderPadding, borderPadding + 240, "Number of Ghosts Correct: " + this.correct, this.textConfig);
            // update alcohol and make sure it isn't past the max
            this.alcohol += this.alcCalc();
            if (this.alcohol > 3) {
                this.alcohol = 3;
            }
        } else {
            // play incorrect sound
            this.wrongSFX.play();
        }
        
        // roll dice/spawn new ghost
        this.rollDice();
    }
    
    alcCalc() {
        // hard coding how much alcohol each dice roll gets back (based on index)
        // sorry my brain was dead and couldn't think of an equation - I will change later
        // alcIncrements[dice roll - 3] is how much alcohol the dice roll gets back
        this.alcIncrements = [0, 0.14, 0.28, 0.42, 0.56, 0.70, 0.84, 1, 1, 0.84, 0.70, 0.56, 0.42, 0.28, 0.14, 0];
        
        return this.alcIncrements[this.diceSum - 3];
    }

    loadWords(inFile) {
        let cache = this.cache.text;
        let allWords = cache.get(inFile);
        this.tempArray = allWords.split('\n');
        for(let i = 0; i < this.tempArray.length; i++){
            this.tempArray[i] = this.tempArray[i].trim();
        }
        return this.tempArray;
    }

    chooseQuote(inNum){
        if(3<= inNum && inNum <= 5){
            return this.goodQuotes[Math.floor(Math.random() * this.goodQuotes.length)];
        }else if(5 < inNum && inNum <= 8){
            return this.goodNeutralQuotes[Math.floor(Math.random() * this.goodNeutralQuotes.length)];
        }else if(8 < inNum && inNum <= 12){
            return this.neutralQuotes[Math.floor(Math.random() * this.neutralQuotes.length)];
        }else if(12 < inNum && inNum <= 15){
            return this.badNeutralQuotes[Math.floor(Math.random() * this.badNeutralQuotes.length)];
        }else if(15 < inNum && inNum <= 18){
            return this.badQuotes[Math.floor(Math.random() * this.badQuotes.length)];
        }
    }
}